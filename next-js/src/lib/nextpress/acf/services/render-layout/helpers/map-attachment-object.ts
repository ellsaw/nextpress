import wpProcessAttachmentURL from "@/lib/nextpress/wordpress/services/helpers/wpProcessAttachmentURL";
import wpGetPostsBase from "@/lib/nextpress/wordpress/services/wpGetPostsBase";

export default async function mapAttachmentObject(return_format: 'id' | 'url', postIds: number[]): Promise<(string | number)[]> {
    if (!postIds.length) return [];

    if (return_format === 'id') {
        return postIds;
    }

    const posts = await wpGetPostsBase(postIds);

    return posts.map(post => wpProcessAttachmentURL(post.guid));
}
