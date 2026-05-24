<?php
namespace Nextpress;

defined('ABSPATH') or die;

require_once __DIR__ . '/app/MetaTable/PostMetaTable.php';
require_once __DIR__ . '/app/MetaTable/TermMetaTable.php';
require_once __DIR__ . '/app/nextpress_save_path.php';

add_action( 'after_switch_theme', function(): void {
    PostMetaTable::instance()->setTable();
    TermMetaTable::instance()->setTable();

    nextpress_migrate_paths();
});

add_action('save_post', fn(int $_post_id, \WP_Post $post, bool $_update) => nextpress_save_post_path($post), 10, 3 );
add_action('saved_term', fn(int $term_id, int $_tt_id, string $taxonomy) => nextpress_save_term_path($term_id, $taxonomy), 10, 3);

