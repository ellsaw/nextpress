import { cache } from "react";
import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { getPageNumber } from "../helpers";
import wpGetPostPage from "@/lib/nextpress/wordpress/services/wpGetPostPage";
import wpResolveTermsFromPath from "@/lib/nextpress/wordpress/services/resolvepath/wpResolveTermsFromPath";
import { CategoryMetadata, CategoryTemplate } from "@/lib/nextpress/wordpress/template-heirarchy/archive/category";
import { TagMetadata, TagTemplate } from "@/lib/nextpress/wordpress/template-heirarchy/archive/tag";
import { TaxonomyMetadata, TaxonomyTemplate } from "@/lib/nextpress/wordpress/template-heirarchy/archive/taxonomy";
import { notFound } from "next/navigation";

const getTerms = cache(async (taxonomy: string, pathString: string) => {
    return await wpResolveTermsFromPath(taxonomy, pathString.split(','));
});

const getPostPage = cache(async (termString: string, page: number) => {
    return await wpGetPostPage({
        terms: termString.split(',').map(Number).filter(id => !isNaN(id) && id !== 0),
        page
    });
});

export function TermArchive(props: { path: string[], metadata: true }): Promise<MetadataResult>;
export function TermArchive(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

export async function TermArchive({ path, metadata = false }: RouteProps) {
    let page = getPageNumber(path);
    if (page) {
        path = path.slice(0, -2);
    } else {
        page = 1;
    }

    const taxonomy = path[0] ?? '';
    const pathString = path.slice(1).join(',');

    const terms = await getTerms(taxonomy, pathString);
    if (!terms) notFound();

    const posts = await getPostPage(terms.map(term => term.termId).join(','), page);

    const mainTerm = terms.find(term => term.slug === path[path.length - 1])!;

    if (taxonomy === 'category') {
        return metadata ? CategoryMetadata({mainTerm, terms, ...posts}) : <CategoryTemplate mainTerm={mainTerm} terms={terms} {...posts} />;
    } else if (taxonomy === 'tag') {
        return metadata ? TagMetadata({mainTerm, terms, ...posts}) : <TagTemplate mainTerm={mainTerm} terms={terms} {...posts} />;
    } else {
        return metadata ? TaxonomyMetadata({mainTerm, terms, ...posts}) : <TaxonomyTemplate mainTerm={mainTerm} terms={terms} {...posts} />;
    }
}
