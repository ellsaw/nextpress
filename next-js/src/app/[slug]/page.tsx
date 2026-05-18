import wpGetPost from "@/lib/wordpress/functions/wpGetPost";

export default async function Index({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug;
    const post = await wpGetPost(undefined, slug);
    if (!post) return;

    return (
        <>
            <h1>{ post.postTitle }</h1>
        </>
    )
}