import { Metadata } from "next";
import { notFound } from "next/navigation";
import pageLayouts from "./components/field-groups/page-layouts";
import { getBlogname } from "@nextpress/services/metadata/get-blogname";
import { RenderComponents } from "@nextpress/ui/render-components";

export async function PageMetadata(): Promise<Metadata> {
    const post = await getThePost();
    if (!post) notFound();

    return {
        title: `${post.postTitle} – ${await getBlogname()}`,
    }
}

export async function PageTemplate() {
    const components = await getField(pageLayouts, 'components');

    if (components) {
        return <RenderComponents layouts={components}/>
    }
}
