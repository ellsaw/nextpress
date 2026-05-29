import { WPPost } from "../../types/common/WPPost";
import WPPostQuery from "../core/WPPostQuery";

export default async function wpGetPosts(id: number|number[]): Promise<WPPost[]> {
    const idArray = Array.isArray(id) ? id : [id];
    if (!idArray.length) return [];

    const query = new WPPostQuery({
        postIn: idArray,
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true,
        metaQuery: [
            {metaKey: '_nextpress_path', as: 'path'},
            {metaKey: '_thumbnail_id', as: 'thumbnailId'}
        ]

    })

    return await query.getPosts();
}
