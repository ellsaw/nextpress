<?php

namespace Nextpress\ACF;

require_once __DIR__ . '/load_acf_fields.php';

add_filter('acf/settings/show_admin', '__return_false');
add_action('acf/init', fn() => load_acf_fields_from_api());
