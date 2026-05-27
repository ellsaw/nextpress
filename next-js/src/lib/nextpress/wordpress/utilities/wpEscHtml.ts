import DOMPurify from "isomorphic-dompurify";

export default function wpEscHtml(string: string) {
    return DOMPurify.sanitize(string);
}

