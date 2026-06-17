const nextpressConfig: NextpressConfig = {
    publicPostTypes: [
        'post',
        'page'
    ],
    publicTaxonomies: [
        'category',
        'tag'
    ],
    excerptLength: 55,
    preLoadOptions: [
        'WPLANG',
        'blogname',
        'site_icon',
        'posts_per_page',
        'sticky_posts',
        'date_format',
        'page_on_front',
        'page_for_posts',
        'theme_mods_nextpress_theme'
    ]
}
export default nextpressConfig;
