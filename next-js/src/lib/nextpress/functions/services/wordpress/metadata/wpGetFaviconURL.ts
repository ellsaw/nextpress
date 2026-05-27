import WPPostQuery from "../../../core/WPPostQuery";
import wpGetOption from "../../wpGetOption";

export default async function wpGetFaviconURL(): Promise<string|undefined> {
    const iconID = await wpGetOption('site_icon');
    if (!iconID) return undefined;

    const query = new WPPostQuery({
        postId: Number(iconID),
        postType: 'attachment',
        postStatus: ['publish', 'inherit'],
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true
    })
    const posts = await query.getPosts();

    const iconMediaPost = posts[0];
    return iconMediaPost?.guid;
}
