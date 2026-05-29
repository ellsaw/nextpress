export default function wpProcessAttachmentURL(guid: string): string {
    const index = guid.indexOf('/wp-content');
    const path = guid.slice(index);

    return `${process.env.WP_SERVICE_URL}${path}`;
}
