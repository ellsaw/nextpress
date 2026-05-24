import { WPPost } from "../../types/entities/WPPost";
import WPPostQuery from "../core/WPPostQuery";
import wpGetOption from "./wpGetOption";

export default async function wpGetPostPage(page: number, terms?: number[], author?: number): Promise<{posts: WPPost[], availablePages: number}> {
    const postsPerPage = Number(await wpGetOption('posts_per_page'));

    const query = new WPPostQuery({
        postType: 'post',
        termIn: terms,
        authorId: author,
        page: page,
        postsPerPage: postsPerPage,
        postStatus: 'publish',
        orderby: 'date'
    });
    const posts = await query.getPosts();
    const postCount = query.getPostCount();

    const availablePages = Math.ceil(postCount / postsPerPage);

    return {
        posts,
        availablePages
    };
}


