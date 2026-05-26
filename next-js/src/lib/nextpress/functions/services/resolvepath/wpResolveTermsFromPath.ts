import { WPTerm } from "../../../types/entities/WPTerm";
import WPTermQuery from "../../core/WPTermQuery";

/**
 * Resolves and validates an array of WordPress terms based on a page's URL path hierarchy.
 *
 * @param {string} taxonomy - The WordPress taxonomy to query.
 * @param {string[]} termPath - The URL path segments extracted from the current page route.
 * @returns {Promise<WPTerm[]>} - The validated terms matching the path hierarchy, or an empty array if invalid.
 */
export default async function wpResolveTermsFromPath(taxonomy: string, termPath: string[]): Promise<WPTerm[]> {
    termPath = termPath.map(path => encodeURIComponent(decodeURIComponent(path)).toLowerCase());
    const query = new WPTermQuery({
        taxonomy: taxonomy,
        termSlug: termPath,
        noFoundRows: true,
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
