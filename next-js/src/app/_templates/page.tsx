import RenderLayout from "@/lib/nextpress/ui/render-layout";
import getBlogname from "@/lib/nextpress/services/metadata/get-blogname";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function PageMetadata(): Promise<Metadata> {
    const post = await getThePost();
    if (!post) notFound();

    return {
        title: `${post.postTitle} – ${await getBlogname()}`,
    }
}

export async function PageTemplate() {
    const post = await getThePost();

    return (
    <>
        {post && <RenderLayout name="components" location={post}/>}
    </>
    )
}
