import { WPPost } from "../../types/core/entities/WPPost";
import WPPostQuery from "../core/WPPostQuery";
import nextpressConfig from "../../config.nextpress";

export default async function wpGetPosts(): Promise<WPPost[]> {
    const query = new WPPostQuery({
        postStatus: 'publish',
        postType: nextpressConfig.publicPostTypes,
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true
    });

    const posts = await query.getPosts()

    return posts;
}

