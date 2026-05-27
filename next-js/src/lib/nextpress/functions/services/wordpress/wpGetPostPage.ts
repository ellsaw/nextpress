import { WPPost } from "../../../types/core/entities/WPPost";
import WPPostQuery from "../../core/WPPostQuery";
import wpGetAttachmentImages from "./wpGetAttachmentImages";
import wpGetOption from "./wpGetOption";

type Post = WPPost & {path?: string, thumbnailId?: string}

type PostPage = {
    posts: (Post & {thumbnail?: WPAttachmentImage})[],
    availablePages: number
}

export default async function wpGetPostPage(page: number, terms?: number[], author?: number): Promise<PostPage> {
    const postsPerPage = Number(await wpGetOption('posts_per_page'));

    const query = new WPPostQuery({
        postType: 'post',
        termIn: terms,
        authorId: author,
        page: page,
        postsPerPage: postsPerPage,
        postStatus: 'publish',
        orderby: 'date',
        metaQuery: [
            {metaKey: '_nextpress_path', as: 'path'},
            {metaKey: '_thumbnail_id', as: 'thumbnailId'}
        ]
    });
    const posts = await query.getPosts();
    const postCount = query.getPostCount();

    const availablePages = Math.ceil(postCount / postsPerPage);

    const thumbnailIds = [
        ...new Set(
            posts
                .map((post) => Number(post.thumbnailId))
                .filter(Boolean)
        )
    ];
    const thumbnailAttachments = await wpGetAttachmentImages(thumbnailIds);
    const thumbnailMap = new Map(
        thumbnailAttachments.map((thumbnail) => [thumbnail.ID, thumbnail])
    );

    return {
        posts: posts.map(post => {
            return {
                ...post,
                thumbnail: post.thumbnailId ? (thumbnailMap.get(Number(post.thumbnailId)) || undefined) : undefined
            }
        }),
        availablePages
    };
}


