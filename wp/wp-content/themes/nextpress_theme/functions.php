<?php

\defined('ABSPATH') or die;

require_once __DIR__ . '/vendor/ellsaw/nextpress-theme/src/index.php';
require_once __DIR__ . '/src/register-nav-menus.php';

if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
}
