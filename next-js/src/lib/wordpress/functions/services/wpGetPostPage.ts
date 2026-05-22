import { WPPost } from "../../types/entities/WPPost";
import WPPostQuery from "../core/WPPostQuery";
import wpGetOption from "./wpGetOption";

export default async function wpGetPostPage(page: number, terms?: number[]): Promise<WPPost[]> {
    const query = new WPPostQuery({
        postType: 'post',
        termIn: terms,
        page: page,
        postsPerPage: Number(await wpGetOption('posts_per_page')),
        orderby: 'date'
    });
    const posts = await query.getPosts();

    return posts;
}


