import { WPTerm } from "../../../types/entities/WPTerm";
import WPTermQuery from "../../core/WPTermQuery";
import wpValidatePath from "./helpers/wpValidatePath";

/**
 * Resolves and validates an array of WordPress terms based on a page's URL path hierarchy.
 *
 * @param {string} taxonomy - The WordPress taxonomy to query.
 * @param {string[]} termPath - The URL path segments extracted from the current page route.
 * @returns {Promise<WPTerm[]>} - The validated terms matching the path hierarchy, or an empty array if invalid.
 */
export default async function wpResolveTermsFromPath(taxonomy: string, termPath: string[]): Promise<WPTerm[]> {
    const query = new WPTermQuery({
        taxonomy: taxonomy,
        termSlug: termPath,
        noFoundRows: true,
    });

    const terms = await query.getTerms();

    const isValidPath = wpValidatePath(termPath, terms, {
        slugKey: 'slug',
        parentKey: 'parent',
        idKey: 'termId'
    });

    return isValidPath ? terms : [];
}
