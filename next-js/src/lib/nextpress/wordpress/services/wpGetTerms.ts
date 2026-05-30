import WPTermQuery from "../core/WPTermQuery";

export default async function wpGetTerms(id: number | number[]) {
    id = Array.isArray(id) ? id : [id];
    const query = new WPTermQuery({
        termId: id,
        noFoundRows: true,
        metaQuery: [{metaKey: '_nextpress_path', as: 'path'}]
    });

    return await query.getTerms();
}
