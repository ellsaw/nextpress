<?php

// Add path postmeta for use in frontend application
function save_nextpress_post_path(int $post_id, WP_Post $post, ?bool $_update = null): void {
    if (wp_is_post_revision($post_id) || $post->post_type === 'attachment') return;
    if (in_array($post->post_status, ['auto-draft', 'trash'])) return;

    if (is_post_type_hierarchical($post->post_type)) {
        $full_path = get_page_uri( $post_id );
    } else {
        $full_path = $post->post_name;
    }
    if (empty($full_path)) return;

    $full_path = '/' . ltrim($full_path, '/');

    update_post_meta( $post_id, '_nextpress_full_path', $full_path);
}
add_action( 'save_post', 'save_nextpress_post_path', 10, 3 );

// Add path termmeta for use in frontend application
function save_nextpress_term_path(int $term_id, ?int $_tt_id, string $taxonomy): void {
    $term = get_term($term_id, $taxonomy);
    if (!($term instanceof WP_Term)) return;

    $slugs = [$term->slug];

    while ( $term->parent != 0 ) {
        $term = get_term($term->parent, $taxonomy);
        if (!($term instanceof WP_Term)) return;

        array_unshift($slugs, $term->slug);
    }

    $full_path = '/' . implode('/', $slugs) . '/';

    update_term_meta( $term_id, '_nextpress_full_path', $full_path );
}
add_action('saved_term', 'save_nextpress_term_path', 10, 3);

// Add path termmeta to all posts on theme switch
function nextpress_run_bulk_path_migration(): void {
    if (function_exists('set_time_limit')) {
        @set_time_limit(300);
    }

    // Posts
    $last_processed_id = 0;
    $batch_size = 200;

    do {
        global $wpdb;
        if (!($wpdb instanceof wpdb)) return;

        try {
            // @phpstan-ignore argument.type
            $post_ids = $wpdb->get_col($wpdb->prepare("
                SELECT ID FROM {$wpdb->posts}
                WHERE ID > %d
                AND post_status IN ('publish', 'draft', 'pending', 'private')
                ORDER BY ID ASC
                LIMIT %d
            ", $last_processed_id, $batch_size));
        } catch (\Throwable $th) {
            error_log('nextpress_run_bulk_path_migration: Error when querying posts: ' . $th->getMessage());
        }
        if (!empty($post_ids)) {
            foreach ($post_ids as $post_id) {
                if (!is_numeric($post_id)) continue;

                $post = get_post((int) $post_id);
                if ($post) {
                    save_nextpress_post_path($post->ID, $post);
                }
            }

            $last_processed_id = end($post_ids);
        }

        if (function_exists('wp_cache_flush_runtime')) {
            wp_cache_flush_runtime();
        }
    } while (!empty($post_ids));

    // Terms
    $taxonomies = get_taxonomies();
    $taxonomy_list = "'" . implode("','", array_map('esc_sql', $taxonomies)) . "'";
    $last_processed_term_id = 0;

    do {
        global $wpdb;
        if (!($wpdb instanceof wpdb)) return;

        try {
            $terms_data = $wpdb->get_results( $wpdb->prepare(
                // @phpstan-ignore argument.type
                "SELECT t.term_id, tt.taxonomy
                FROM " . $wpdb->terms . " AS t
                INNER JOIN " . $wpdb->term_taxonomy . " AS tt ON t.term_id = tt.term_id
                WHERE t.term_id > %d
                AND tt.taxonomy IN (" . $taxonomy_list . ")
                ORDER BY t.term_id ASC
                LIMIT %d",
                $last_processed_term_id,
                $batch_size
            ) );
        } catch (\Throwable $th) {
            error_log('nextpress_run_bulk_path_migration: Error when querying terms: ' . $th->getMessage());
        }

        if (!empty($terms_data)) {
            foreach ($terms_data as $term_row) {
                if (!is_numeric($term_row->term_id) || !is_string($term_row->taxonomy)) continue;

                save_nextpress_term_path((int) $term_row->term_id, null, $term_row->taxonomy);

                $last_processed_term_id = (int) $term_row->term_id;
            }
        }

        if (function_exists('wp_cache_flush_runtime')) {
            wp_cache_flush_runtime();
        }
    } while (!empty($terms_data));
}

function nextpress_theme_activation_hook(): void {
    nextpress_run_bulk_path_migration();
}
add_action( 'after_switch_theme', 'nextpress_theme_activation_hook' );
