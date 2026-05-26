<?php

namespace Nextpress;

function nextpress_switch_theme(): void {
    PostMetaTable::instance()->setTable();
    TermMetaTable::instance()->setTable();

    nextpress_migrate_paths();
}

function nextpress_setup_theme(): void {
    add_theme_support('title-tag');

    add_theme_support('custom-logo');
    add_theme_support('post-thumbnails');

    remove_theme_support('core-block-patterns');

    register_nav_menus(
        array(
            'primary' => __('Primary Menu', 'nextpress'),
            'footer' => __('Footer Menu', 'nextpress'),
        )
    );
}
