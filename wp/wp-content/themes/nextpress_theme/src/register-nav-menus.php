<?php

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
