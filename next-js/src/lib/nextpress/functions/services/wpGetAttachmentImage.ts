import { unserialize } from "php-serialize";
import { WPAttachment } from "../../types/entities/WPAttachment";
import wpGetAttachmentPost from "./wpGetAttachmentPost";

type WPAttachementImage = {
    src: string,
    alt?: string,
    height: number,
    width: number,
}

export default async function wpGetAttachmentImage(id?: number, attachment?: WPAttachment): Promise<WPAttachementImage | undefined> {
    if (!id && !attachment) return;

    const attachmentPost = attachment ?? await wpGetAttachmentPost(id!);
    if (!attachmentPost) return;

    const imagePath = (() => {
        const index = attachmentPost.guid.indexOf('/wp-content');
        return attachmentPost.guid.slice(index);
    })();

    try {
        const metadata: {height?: string, width?: string} = unserialize(attachmentPost?.metaData ?? '');
        if (!metadata.height || !metadata.width) return;

        return {src: `${process.env.WP_SITE_URL}${imagePath}`, alt: attachmentPost.altText, height: Number(metadata.height), width: Number(metadata.width)}
    } catch (error: any) {
        console.warn('wpGetAttachmentImage: Could not unserialize php: ', error.message);
    }
}
