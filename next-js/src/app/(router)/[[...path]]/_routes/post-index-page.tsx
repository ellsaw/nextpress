import { HomeMetadata, HomeTemplate } from "@/lib/nextpress/template-heirarchy/home/home";
import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { getPageNumber } from "../helpers";
import getOption from "@/lib/nextpress/services/get-option";
import { getNextpressStore } from "@/lib/nextpress/globals/globals";

export function PostIndexPage(props: { path: string[], metadata: true }): Promise<MetadataResult>;
export function PostIndexPage(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

export async function PostIndexPage({ path, metadata = false }: RouteProps) {
    const page = getPageNumber(path) || 1;
    const postsPerPage = Number(await getOption('posts_per_page')) ?? 10;

    const postIds = await postLoader.findAndPrime({
        noFoundRows: false,
        noPaging: false,
        postType: 'post',
        page: page,
        postsPerPage: postsPerPage,
        postStatus: 'publish',
        orderBy: 'date'
    });

    const currentQueriedObject = {
        posts: postIds.ids,
        page,
        pageCount: postIds.count / postsPerPage
    }

    const store = getNextpressStore();
    store.currentStore = currentQueriedObject;

    return metadata ? await HomeMetadata() : <HomeTemplate/>;
}

