import { WPPost } from "../../types/core/entities/WPPost";
import nextpressConfig from "../../config.nextpress";

export default function wpGetTheExcerpt(post: WPPost): string {
    if (post.postExcerpt) return post.postExcerpt;

    if (!post.postContent) return '';

    const plainText = post.postContent
        .replace(/<[^>]+>/g, ' ') // Strip HTML tags
        .replace(/\s+/g, ' ')     // Normalize multiple spaces into a single space
        .trim();

    const words = plainText.split(' ');
    if (words.length > nextpressConfig.excerptLength) {
        return words.slice(0, nextpressConfig.excerptLength).join(' ') + '...';
    }

    return plainText;
}
