export default function processURL(url: string): string {
    if (!process.env.WP_SITE_URL) return url;

    if (url.startsWith(process.env.WP_SITE_URL)) {
        url = url.slice(process.env.WP_SITE_URL.length);
    }

    return url || '/';
}
