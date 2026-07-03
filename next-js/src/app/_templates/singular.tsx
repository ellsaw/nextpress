import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogname } from "nextpress/services/metadata/get-blogname";

export async function SingularMetadata(): Promise<Metadata> {
    const post = (await getThePosts())[0];
    if (!post) notFound();

    return {
        title: `${post.postTitle} – ${await getBlogname()}`,
    }
}

export async function SingularTemplate() {
    const post = (await getThePosts())[0];
    if (!post) notFound();

    return (
        <>
        <h1>{post.postTitle}</h1>
        </>
    )
}
