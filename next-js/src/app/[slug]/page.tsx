import getPost from '../../utils/getPost';

export default async function Index({
    params
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug;
    const post = await getPost(slug);
    if (!post) return;

    return (
        <>
            <h1>{ post.post_title }</h1>
        </>
    )
}