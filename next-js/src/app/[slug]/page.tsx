import WPGetPost from "@/lib/wordpress/core/WPGetPost";

export default async function Index({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug;
    const post = await WPGetPost('post_name', slug);
    if (!post) return;

    return (
        <>
            <h1>{ post.post_title }</h1>
        </>
    )
}