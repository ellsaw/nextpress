import WPTermQuery from "../../core/WPTermQuery";

export default async function wpResolveTermsFromPath(taxonomy: string, termPath: string[]) {
    termPath = termPath.map(path => encodeURIComponent(decodeURIComponent(path)).toLowerCase());
    const query = new WPTermQuery({
        taxonomy: taxonomy,
        termSlug: termPath,
        noFoundRows: true,
        metaQuery: [{metaKey: '_nextpress_path', as: 'path'}]
    });

    const terms = await query.getTerms();

    const mainTerm = terms.find(term => term.slug === termPath[termPath.length - 1]);
    const mainTermPathArray = mainTerm?.path?.split('/').filter(Boolean) ?? [];

    if (termPath.length === mainTermPathArray.length && mainTermPathArray.every((value, index) => value === mainTermPathArray[index])) {
        return terms;
    } else {
        return [];
    }
}
