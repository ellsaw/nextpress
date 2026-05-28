import { WPPostPage } from "../../types/common/WPPost";
import WPPostQuery from "../core/WPPostQuery";
import wpGetAttachmentImages from "./wpGetAttachmentImages";
import wpGetOption from "./wpGetOption";

type Params = {
    page: number,
    terms?: number[],
    author?: number
    postTypes?: string[]
}

export default async function wpGetPostPage({ page, terms, author, postTypes }: Params): Promise<WPPostPage> {
    const postsPerPage = Number(await wpGetOption('posts_per_page'));

    const query = new WPPostQuery({
        postType: postTypes ?? 'post',
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
        availablePages,
        page
    };
}


