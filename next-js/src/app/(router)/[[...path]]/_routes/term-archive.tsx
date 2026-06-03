import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { getPageNumber } from "../helpers";
import { CategoryMetadata, CategoryTemplate } from "@/lib/nextpress/template-heirarchy/archive/category";
import { TagMetadata, TagTemplate } from "@/lib/nextpress/template-heirarchy/archive/tag";
import { TaxonomyMetadata, TaxonomyTemplate } from "@/lib/nextpress/template-heirarchy/archive/taxonomy";
import { notFound } from "next/navigation";
import getOption from "@/lib/nextpress/services/get-option";
import { getNextpressStore } from "@/lib/nextpress/globals/globals";

export function TermArchive(props: { path: string[], metadata: true }): Promise<MetadataResult>;
export function TermArchive(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

export async function TermArchive({ path, metadata = false }: RouteProps) {
    const postsPerPage = Number(await getOption('posts_per_page')) ?? 10;

    let page = getPageNumber(path);
    if (page) {
        path = path.slice(0, -2);
    } else {
        page = 1;
    }

    const taxonomy = path[0] ?? '';
    const pathString = path.slice(1).join('/');

    const termQuery = await termLoader.findAndPrime({
        taxonomy,
        path: `/${pathString}`
    });
    if (!termQuery.ids.length) notFound();

    const postIds = await postLoader.findAndPrime({
        termIn: termQuery.ids,
        noFoundRows: false,
        noPaging: false,
        postType: 'post',
        page: page,
        postsPerPage: postsPerPage,
        postStatus: 'publish',
        orderBy: 'date'
    });

    const terms = await getTerms(termQuery.ids);
    const mainTerm = terms.find(term => term.slug === path[path.length - 1])!;

    const currentQueriedObject = {
        posts: postIds.ids,
        page,
        pageCount: Math.ceil(postIds.count / postsPerPage),
        mainTerm: mainTerm.termId,
        terms: termQuery.ids
    };

    const store = getNextpressStore();
    store.currentStore = currentQueriedObject;

    if (taxonomy === 'category') {
        return metadata ? await CategoryMetadata() : <CategoryTemplate/>;
    } else if (taxonomy === 'tag') {
        return metadata ? await TagMetadata() : <TagTemplate/>;
    } else {
        return metadata ? await TaxonomyMetadata() : <TaxonomyTemplate/>;
    }
}
