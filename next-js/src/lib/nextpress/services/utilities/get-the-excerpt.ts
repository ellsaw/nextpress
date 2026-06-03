import nextpressConfig from "../../../../../config.nextpress";
import { IPost } from "../../entities/post/post";

const excerptLength = nextpressConfig.excerptLength ?? 55;

export default function getTheExcerpt(post: IPost): string {
    const excerpt = post.postExcerpt;
    if (excerpt) return excerpt;

    const postContent = post.postContent;
    if (!postContent) return '';

    const plainText = postContent
        .replace(/<[^>]+>/g, ' ') // Strip HTML tags
        .replace(/\s+/g, ' ')     // Normalize multiple spaces into a single space
        .trim();

    const words = plainText.split(' ');
    if (words.length > (excerptLength)) {
        return words.slice(0, excerptLength).join(' ') + '...';
    }

    return plainText;
}
