import WPTermQuery from "../core/WPTermQuery";

export default async function wpGetAllTerms(taxonomies: string[]) {
    if (!taxonomies.length) return [];

    const query = new WPTermQuery({
        taxonomy: taxonomies,
        noFoundRows: true,
        metaQuery: [{metaKey: '_nextpress_path', as: 'path'}]
    });

    return await query.getTerms();
}
