import { Selectable } from "kysely";
import { WpPost } from "../types/wpdb/wpdb";
import WPPostQuery from "./core/WPPostQuery";

export default async function wpGetPost(id?: number, slug?: string): Promise<Selectable<WpPost> | undefined> {
    const posts = 
        await new WPPostQuery()
            .setPostId({postId: id})
            .setPostContent({postSlug: slug})
            .setPostType({postTypeNot: 'revision'})
            .setPostStatus({postStatus: 'publish'})
            .setOrder({ignoreOrder: true, ignoreStickyPosts: true,})
            .setPagination({nopaging: true, noFoundRows: true})
            .getPosts();

    if (posts.length === 0) return;

    return posts[0];
}