import DOMPurify from "isomorphic-dompurify";

export default function escHtml(string: string) {
    return DOMPurify.sanitize(string);
}

