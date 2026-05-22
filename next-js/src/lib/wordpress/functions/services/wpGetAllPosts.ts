import { WPPost } from "../../types/entities/WPPost";
import WPPostQuery from "../core/WPPostQuery";
import wpconfig from "../../wpconfig";

export default async function wpGetPosts(): Promise<WPPost[]> {
    const query = new WPPostQuery({
        postStatus: 'publish',
        postType: wpconfig.publicPostTypes,
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true
    });

    const posts = await query.getPosts()

    return posts;
}

