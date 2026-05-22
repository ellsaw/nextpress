import { WPPost } from "../../types/entities/WPPost";
import WPPostQuery from "../core/WPPostQuery";
import wpGetOption from "./wpGetOption";

export default async function wpGetPostPage(page: number, terms?: number[], author?: number): Promise<WPPost[]> {
    const query = new WPPostQuery({
        postType: 'post',
        termIn: terms,
        authorId: author,
        page: page,
        postsPerPage: Number(await wpGetOption('posts_per_page')),
        postStatus: 'publish',
        orderby: 'date'
    });
    const posts = await query.getPosts();

    return posts;
}


