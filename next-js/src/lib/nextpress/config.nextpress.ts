const nextpressConfig: NextpressConfig = {
    publicPostTypes: [
        'post',
        'page'
    ],
    excerptLength: 55,
    preLoadOptions: [
        'WPLANG',
        'blogname',
        'site_icon',
        'posts_per_page',
        'sticky_posts',
        'date_format',
        'page_on_front'
    ]
}
export default nextpressConfig;
