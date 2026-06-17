<?php

namespace Nextpress;

/**
 * Handles operations that should occur upon switching themes.
 *
 * @return void
 */
function nextpress_switch_theme(): void {
    nextpress_migrate_paths();
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 *
 * @return void
 */
function nextpress_setup_theme(): void {
    // Adds support for the Custom Logo feature, allowing site administrators to easily upload and manage a site logo through the WordPress Customizer.
    add_theme_support('custom-logo');

    // Enables support for Featured Images
    // This allows users to attach a main image to posts, pages, or custom post types.
    add_theme_support('post-thumbnails');

    // Disables the default, out-of-the-box block patterns that come bundled with WordPress.
    remove_theme_support('core-block-patterns');

    // Registers specific locations in the theme where navigation menus can be placed.
    // Once registered, site admins can build custom menus in Appearance > Menus and assign them there.
    register_nav_menus(
        array(
            // Creates a menu location identified as 'primary' and labeled "Primary Menu"
            'primary' => __('Primary Menu', 'nextpress'),

            // Creates a menu location identified as 'footer' and labeled "Footer Menu"
            'footer' => __('Footer Menu', 'nextpress'),
        )
    );
}
