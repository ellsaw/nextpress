<?php
/**
 * Plugin Name: Nextpress MU Loader
 * Description: Forces activation of Secure Custom Fields and SVG Support.
 */

if ( file_exists( WP_PLUGIN_DIR . '/secure-custom-fields/secure-custom-fields.php' ) ) {
    require_once WP_PLUGIN_DIR . '/secure-custom-fields/secure-custom-fields.php';
}
if ( file_exists( WP_PLUGIN_DIR . '/svg-support/svg-support.php' ) ) {
    require_once WP_PLUGIN_DIR . '/svg-support/svg-support.php';
}

add_filter('all_plugins', function($plugins) {
    unset($plugins['secure-custom-fields/secure-custom-fields.php']);
    unset($plugins['svg-support/svg-support.php']);
    return $plugins;
});
