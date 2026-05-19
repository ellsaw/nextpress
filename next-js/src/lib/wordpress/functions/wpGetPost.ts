import { Selectable } from "kysely";
import wpPostQuery from "./core/wpPostQuery";
import { WpPost } from "../types/wpdb/wpdb";

export default async function wpGetPost(id?: number, slug?: string): Promise<Selectable<WpPost> | undefined> {
    const post = await wpPostQuery({
        postId: id,
        postName: slug,
        nopaging: true,
        noFoundRows: true,
        ignoreStickyPosts: true,
        ignoreOrder: true,
        postTypeNot: 'revision'
    })
    if (post.length === 0) return;

    return post[0];
}