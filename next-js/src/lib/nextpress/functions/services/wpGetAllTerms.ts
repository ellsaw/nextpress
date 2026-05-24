import { WPTerm } from "../../types/entities/WPTerm";
import WPTermQuery from "../core/WPTermQuery";

export default async function wpGetAllTerms(taxonomies: string[]): Promise<WPTerm[]> {
    const query = new WPTermQuery({
        taxonomy: taxonomies,
        noFoundRows: true,
    });

    return await query.getTerms();
}
