import nextpressConfig from "../../../../../../config.nextpress";
import WPPostQuery from "../../core/WPPostQuery";

export default async function wpResolvePostFromPath(postPath: string[]) {
    postPath = postPath.map(path => encodeURIComponent(decodeURIComponent(path)).toLowerCase());

    const query = new WPPostQuery({
        postSlug: postPath[postPath.length - 1],
        postType: nextpressConfig.publicPostTypes,
        postStatus: 'publish',
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true,
        metaQuery: [
            {metaKey: '_nextpress_path', as: 'path'},
            {metaKey: '_thumbnail_id', as: 'thumbnailId'}
        ]
    });
    const posts = await query.getPosts();
    const post = posts[0];

    const pathArray = post?.path?.split('/').filter(Boolean) ?? [];

    if (postPath.length === pathArray.length && postPath.every((value, index) => value === pathArray[index])) {
        return post;
    }
}
