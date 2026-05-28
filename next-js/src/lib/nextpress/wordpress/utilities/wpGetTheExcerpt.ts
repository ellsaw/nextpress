import { WPPostBase } from "../../types/core/entities/WPPostBase";
import nextpressConfig from "../../../../../config.nextpress";

const excerptLength = nextpressConfig.excerptLength ?? 55;

export default function wpGetTheExcerpt(post: WPPostBase): string {
    if (post.postExcerpt) return post.postExcerpt;

    if (!post.postContent) return '';

    const plainText = post.postContent
        .replace(/<[^>]+>/g, ' ') // Strip HTML tags
        .replace(/\s+/g, ' ')     // Normalize multiple spaces into a single space
        .trim();

    const words = plainText.split(' ');
    if (words.length > (excerptLength)) {
        return words.slice(0, excerptLength).join(' ') + '...';
    }

    return plainText;
}
