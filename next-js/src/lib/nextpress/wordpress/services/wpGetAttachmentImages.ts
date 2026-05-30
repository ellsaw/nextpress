import { unserialize } from "php-serialize";
import WPPostQuery from "../core/WPPostQuery";
import wpProcessAttachmentURL from "./helpers/wpProcessAttachmentURL";

export default async function wpGetAttachmentImages(id: number | number[]): Promise<WPAttachmentImage[]> {
    const idArray = Array.isArray(id) ? id : [id];
    if (!idArray.length) return [];

    const query = new WPPostQuery({
        postIn: idArray,
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true,
        metaQuery: [
            {metaKey: '_wp_attachment_image_alt', as: 'altText'},
            {metaKey: '_wp_attachment_metadata', as: 'metaData'}
        ]
    })

    const attachmentPosts = await query.getPosts();

    return attachmentPosts.flatMap((attachmentPost) => {
        const path = wpProcessAttachmentURL(attachmentPost.guid);

        try {
            const metadata: {height?: string, width?: string} = unserialize(attachmentPost?.metaData ?? '');
            if (!metadata.height || !metadata.width) return [];

            return [{
                ID: attachmentPost.ID,
                src: path,
                alt: attachmentPost.altText,
                height: Number(metadata.height),
                width: Number(metadata.width)
            }];
        } catch (error: any) {
            console.warn('wpGetAttachmentImage: Could not unserialize php: ', error.message);
            return [];
        }
    });
}
