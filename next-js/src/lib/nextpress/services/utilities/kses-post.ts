import parse from 'html-react-parser';
import DOMPurify from "isomorphic-dompurify";

export default function wpKsesPost(html: string) {
    const cleanHtml = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
    return parse(cleanHtml);
}
