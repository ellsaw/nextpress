<?php

namespace Nextpress;

use WP_Admin_Bar;
use WP_Post;
use WP_Error;
use WP_Query;
use WP_REST_Request;
use WP_REST_Response;
use WP_Rewrite;
use WP_Scripts;
use WP_Styles;

add_action('rest_api_init', function() {
    register_rest_route(
        'nextpress/v1',
        '/get-admin-bar/',
        [
            'methods' => 'GET',
            'callback' => __NAMESPACE__ . '\handle_get_admin_bar_response',
            'permission_callback' => __NAMESPACE__ . '\validate_get_admin_bar',
            'args' => [
                'user_id' => [
                    'type' => 'integer',
                    'required' => false,
                    'sanitize_callback' => 'absint',
                ],
                'path' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ]
            ]
        ]
    );
});

function validate_get_admin_bar(WP_REST_Request $request): bool | WP_Error {
    $api_key = getenv_docker('CROSS_CONTAINER_API_KEY', '');
    $auth_header = $request->get_header('Authorization');

    $passed_key = '';
    if (!empty($auth_header) && preg_match('/api-key\s(\S+)/', $auth_header, $matches)) {
        $passed_key = $matches[1];
    }

    if (!\is_string($api_key) || empty($api_key) || !hash_equals($api_key, $passed_key)) {
        return new WP_Error('rest_forbidden', __('Unauthorized API Key.'), ['status' => 401]);
    }

    return true;
}

function handle_get_admin_bar_response(WP_REST_Request $request): WP_REST_Response {
    global $post, $wp_admin_bar, $wp_query, $wp_the_query, $wp_styles, $wp_scripts, $wp_rewrite;

    if (!class_exists('WP_Admin_Bar')) {
        if (file_exists(ABSPATH . WPINC . '/class-wp-admin-bar.php')) {
            require_once ABSPATH . WPINC . '/class-wp-admin-bar.php';
        }
    }

    $wp_admin_bar = new WP_Admin_Bar();

    if (!($wp_query instanceof WP_Query)) {
        $wp_query = new WP_Query();
    }
    if (!($wp_rewrite instanceof WP_Rewrite)) {
        $wp_rewrite = new WP_Rewrite();
    }
    if (!($wp_styles instanceof WP_Styles)) {
        $wp_styles = new WP_Styles();
    }
    if (!($wp_scripts instanceof WP_Scripts)) {
        $wp_scripts = new WP_Scripts();
    }

    /** @var string */
    $user_id = $request->get_param('user_id');
    if (!$user_id) {
        return new WP_REST_Response(['success' => false, 'error' => 'Empty user'], 400);
    }

    wp_set_current_user(absint($user_id));

    /** @var string */
    $path = $request->get_param('path');
    $full_url = home_url((string)$path);
    $cleaned_path = trim((string)$path, '/');

    $post_id = url_to_postid($full_url);
    $query_vars = [];
    if ($post_id) {
        $target_post = get_post($post_id);
        if ($target_post) {
            $query_vars[$target_post->post_type === 'page' ? 'page_id' : 'p'] = $post_id;
        }
    } elseif ($cleaned_path === '') {
        $front_page_id = get_option('page_on_front');
        if ($front_page_id > 0) {
            $query_vars['page_id'] = $front_page_id;
        } else {
            $query_vars['is_home'] = 1;
        }
    }

    // @phpstan-ignore argument.type
    $wp_query->parse_query($query_vars);
    $posts = $wp_query->get_posts();

    if ($wp_query->is_singular && !empty($posts)) {
        $post = $posts[0];
        $wp_query->queried_object = $post instanceof WP_Post ? $post : get_post($post);
        $wp_query->queried_object_id = $post instanceof WP_post ? $post->ID : $post;
    } elseif ($wp_query->is_archive || $wp_query->is_home) {
        $wp_query->queried_object = $wp_query->get_queried_object();
        if (isset($wp_query->queried_object->term_id)) {
            $wp_query->queried_object_id = is_numeric($wp_query->queried_object->term_id) ? absint($wp_query->queried_object->term_id) : 0;
        }
    }

    $admin_bar_html = '';
    add_filter('show_admin_bar', '__return_true', 999);

    _wp_admin_bar_init();
    do_action('admin_bar_init');

    ob_start();
        wp_admin_bar_render();
    $admin_bar_html = ob_get_clean();

    wp_default_styles($wp_styles);
    wp_default_scripts($wp_scripts);

    $admin_bar_css = '/wp-includes/css/admin-bar.min.css';
    $dashicons_css = '/wp-includes/css/dashicons.min.css';
    $admin_bar_js  = '/wp-includes/js/admin-bar.min.js';

    if (isset($wp_styles->registered['admin-bar']->src)) {
        $admin_bar_css = $wp_styles->registered['admin-bar']->src;
    }
    if (isset($wp_styles->registered['dashicons']->src)) {
        $dashicons_css = $wp_styles->registered['dashicons']->src;
    }
    if (isset($wp_scripts->registered['admin-bar']->src)) {
        $admin_bar_js = $wp_scripts->registered['admin-bar']->src;
    }

    $assets = [
        'css' => [
            'admin_bar' => site_url((string)$admin_bar_css),
            'dashicons' => site_url((string)$dashicons_css),
        ],
        'js' => [
            'admin_bar' => site_url((string)$admin_bar_js),
        ]
    ];

    return new WP_REST_Response([
        'success' => true,
        'html'    => $admin_bar_html,
        'assets'  => $assets,
    ], 200);
}
