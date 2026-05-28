import WPPostQuery from "../core/WPPostQuery";

type Args =
    | { id: number; slug?: never }
    | { id?: never; slug: string };

export default async function wpGetPage({ id, slug }: Args) {
    const query = new WPPostQuery({
        postId: id,
        postSlug: slug,
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true
    })
    const posts = await query.getPosts();
    if (!posts.length) return;

    return posts[0];
}
