import { PageMetadata, PageTemplate } from "@/lib/nextpress/template-heirarchy/page/page";
import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { PostIndexPage } from "./post-index-page";
import { getPageNumber } from "../helpers";
import { notFound } from "next/navigation";
import { SingleMetadata, SingleTemplate } from "@/lib/nextpress/template-heirarchy/page/single";
import getOption from "@/lib/nextpress/services/get-option";
import { queriedObjectState } from "@/lib/nextpress/globals/globals";

export function SingularPage(props: { path: string[], metadata: true }): Promise<MetadataResult>;
export function SingularPage(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

export async function SingularPage({ path, metadata = false }: RouteProps) {
    let page = getPageNumber(path);
    if (page) {
        path = path.slice(0, -2);
    } else {
        page = 1;
    }

    const postId = (await postLoader.findAndPrime({
        path: `/${path.join('/')}`,
        multiple: false,
        noFoundRows: true,
        noPaging: true,
        ignoreStickyPosts: true,
    })).ids[0];
    if (!postId) notFound();

    const post = await getPost(postId) ?? notFound()

    const postType = post.postType

    const currentQueriedObject = {
        posts: [postId]
    }
    const state = queriedObjectState();
    state.currentState = currentQueriedObject;

    if (postType === 'post') {
        return metadata ? await SingleMetadata() : <SingleTemplate/>;
    }
    if (post.ID !== Number(await getOption('page_for_posts'))) {
        return metadata ? await PageMetadata() : <PageTemplate/>;
    } else {
        return metadata ? await PostIndexPage({path, metadata: true}) : <PostIndexPage path={path}/>
    }
}

