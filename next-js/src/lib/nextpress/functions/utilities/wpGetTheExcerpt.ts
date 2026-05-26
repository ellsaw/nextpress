import { WPPost } from "../../types/core/entities/WPPost";
import DOMPurify from "isomorphic-dompurify";
import wpconfig from "../../wpconfig";

export default function wpGetTheExcerpt(post: WPPost): string {
    if (post.postExcerpt) return post.postExcerpt;

    const cleanedContent = DOMPurify.sanitize(post.postContent, { RETURN_DOM: true }).textContent;
    if (!cleanedContent) return '';

    const words = cleanedContent.split(' ');
    if (words.length > wpconfig.excerptLength) {
        return words.slice(0, wpconfig.excerptLength).join(' ') + '...';
    }
    return cleanedContent;
}
