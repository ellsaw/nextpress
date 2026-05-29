import WPPostQuery from "../core/WPPostQuery";
import { WPPostBase } from "../../types/core/entities/WPPostBase";

export default async function wpGetPostsBase(id: number | number[]): Promise<WPPostBase[]> {
    const idArray = Array.isArray(id) ? id : [id];
    if (!idArray.length) return [];

    const query = new WPPostQuery({
        postIn: idArray,
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true,
    })

    return await query.getPosts();
}

