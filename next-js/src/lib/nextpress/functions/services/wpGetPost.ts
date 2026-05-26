import { WPPost } from "../../types/core/entities/WPPost";
import WPPostQuery from "../core/WPPostQuery";

export default async function wpGetPost(id?: number, slug?: string): Promise<WPPost | undefined> {
    const query = new WPPostQuery({
        postId: id,
        postSlug: slug,
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true
    })
    const posts = await query.getPosts();

    if (posts.length === 0) return;

    return posts[0];
}
