<?php

namespace Nextpress;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

add_action('rest_api_init', function() {
    register_rest_route(
        'nextpress/v1',
        '/validate-user-session/',
        [
            'methods' => 'GET',
            'callback' => __NAMESPACE__ . '\handle_session_response',
            'permission_callback' => __NAMESPACE__ . '\validate_user_session',
            'args' => [
                'user_hash' => [
                    'type' => 'string',
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ]
            ]
        ]
    );
});

function validate_user_session(WP_REST_Request $request): bool | WP_Error {
    $api_key = getenv_docker('CROSS_CONTAINER_API_KEY', '');
    $auth_header = $request->get_header('Authorization');

    $passed_key = '';
    if (!empty($auth_header) && preg_match('/api-key\s(\S+)/', $auth_header, $matches)) {
        $passed_key = $matches[1];
    }

    if (!\is_string($api_key) || empty($api_key) || !hash_equals($api_key, $passed_key)) {
        return new WP_Error('rest_forbidden', __('Unauthorized API Key.'), ['status' => 401]);
    }

    $passed_hash = (string) (\is_scalar($request->get_param('user_hash')) ? $request->get_param('user_hash') : '');

    $user_id = !empty($passed_hash)
        ? wp_validate_auth_cookie($passed_hash, 'logged_in')
        : wp_validate_auth_cookie('', 'logged_in');

    if (!$user_id) {
        return new WP_Error('rest_cookie_invalid', __('Invalid session hash.'), ['status' => 401]);
    }

    return true;
}

function handle_session_response(WP_REST_Request $_request): WP_REST_Response {
    return new WP_REST_Response(null, 200);
}
