import { WPAttachment } from "../../types/entities/WPAttachment";
import WPPostQuery from "../core/WPPostQuery";

export default async function wpGetAttachmentPost(id: number): Promise<WPAttachment | undefined> {
    const query = new WPPostQuery({
        postId: id,
        postType: 'attachment',
        postStatus: ['publish', 'inherit'],
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true,
        noPath: true,
        metaQuery: [
            {metaKey: '_wp_attachment_image_alt', as: 'altText'},
            {metaKey: '_wp_attachment_metadata', as: 'metaData'}
        ]
    })

    const posts = await query.getPosts() as unknown as WPAttachment[];
    return posts[0];
}
