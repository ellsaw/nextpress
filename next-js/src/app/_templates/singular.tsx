import { WPSingleQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import wpGetBlogname from "@/lib/nextpress/wordpress/services/metadata/wpGetBlogname";
import { Metadata } from "next";

export async function SingularMetadata({ post }: WPSingleQueriedObject): Promise<Metadata> {
    return {
        title: `${post.postTitle} – ${await wpGetBlogname()}`,
    }
}

export async function SingularTemplate({ post }: WPSingleQueriedObject) {
    return (
        <>
        <h1>{post.postTitle}</h1>
        </>
    )
}
