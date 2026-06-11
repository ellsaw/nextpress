import RenderLayout from "@/lib/nextpress/acf/services/render-layout/render-layout";
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
    return <RenderLayout name="components"/>
}
