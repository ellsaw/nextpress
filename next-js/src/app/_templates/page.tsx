import ACFRenderLayout from "@/lib/nextpress/acf/services/render-layout/acf-render-layout";
import { WPSingleQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import wpGetBlogname from "@/lib/nextpress/wordpress/services/metadata/wpGetBlogname";
import { Metadata } from "next";

export async function PageMetadata({ post }: WPSingleQueriedObject): Promise<Metadata> {
    return {
        title: `${post.postTitle} – ${await wpGetBlogname()}`,
    }
}

export async function PageTemplate({ post }: WPSingleQueriedObject) {
    return <ACFRenderLayout name="components" post={post}/>
}
