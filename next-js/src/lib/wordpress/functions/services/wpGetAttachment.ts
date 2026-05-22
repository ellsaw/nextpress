import { WPPost } from "../../types/entities/WPPost";
import WPPostQuery from "../core/WPPostQuery";

export default async function wpGetAttachment(id: number): Promise<WPPost | undefined> {
    const query = new WPPostQuery({
        postId: id,
        postType: 'attachment',
        postStatus: ['publish', 'inherit'],
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true
    })
    const posts = await query.getPosts();

    if (posts.length === 0) return;

    return posts[0];
}
