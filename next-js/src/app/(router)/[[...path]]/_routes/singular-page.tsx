import { PageMetadata, PageTemplate } from "@/lib/nextpress/wordpress/template-heirarchy/page/page";
import { cache } from "react";
import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { PostIndexPage } from "./post-index-page";
import wpResolvePostFromPath from "@/lib/nextpress/wordpress/services/resolvepath/wpResolvePostFromPath";
import { getPageNumber } from "../helpers";
import { notFound } from "next/navigation";
import wpGetOption from "@/lib/nextpress/wordpress/services/wpGetOption";
import wpGetAttachmentImages from "@/lib/nextpress/wordpress/services/wpGetAttachmentImages";
import { SingleMetadata, SingleTemplate } from "@/lib/nextpress/wordpress/template-heirarchy/page/single";

const getPost = cache(async (pathString: string) => {
    return await wpResolvePostFromPath(pathString.split(','));
});

const getThumbnail = cache(async (thumbnailId: number) => {
    return (await wpGetAttachmentImages(thumbnailId))[0];
});

export function SingularPage(props: { path: string[], metadata: true }): Promise<MetadataResult>;
export function SingularPage(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

export async function SingularPage({ path, metadata = false }: RouteProps) {
    let page = getPageNumber(path);
    if (page) {
        path = path.slice(0, -2);
    } else {
        page = 1;
    }

    const post = await getPost(path.join(','));
    if (!post) notFound();

    if (post.postType === 'post') {
        const thumbnail = await getThumbnail(Number(post.thumbnailId));

        return metadata ? SingleMetadata({post: {...post, thumbnail}}) : <SingleTemplate post={{...post, thumbnail}}/>;
    }

    if (post.ID === Number(await wpGetOption('page_for_posts'))) {
        return metadata ? PostIndexPage({path, metadata: true}) : <PostIndexPage path={path}/>
    } else {
        return metadata ? PageMetadata({post: post}) : <PageTemplate post={post}/>;
    }
}

