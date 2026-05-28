import WPPostQuery from "../core/WPPostQuery";

export default async function wpGetAllPosts(postTypes: string[]) {
    if (!postTypes.length) return [];
    const query = new WPPostQuery({
        postStatus: 'publish',
        postType: postTypes,
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true,
        metaQuery: [{metaKey: '_nextpress_path', as: 'path'}]
    });

    const posts = await query.getPosts()

    return posts;
}

