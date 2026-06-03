import ACFRenderLayout from "@/lib/nextpress/acf/services/render-layout/acf-render-layout";
import getBlogname from "@/lib/nextpress/services/metadata/get-blogname";
import { QueriedObject } from "@/lib/nextpress/template-heirarchy/queried-object";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function PageMetadata(): Promise<Metadata> {
    const post = (await getThePosts())[0];
    if (!post) notFound();

    return {
        title: `${post.postTitle} – ${await getBlogname()}`,
    }
}

export async function PageTemplate(post: QueriedObject) {
    return <ACFRenderLayout name="components" post={post}/>
}
