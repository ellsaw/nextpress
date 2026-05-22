import wpResolveTermsFromPath from "@/lib/wordpress/functions/services/resolvepath/wpResolveTermsFromPath";
import { WPTerm } from "@/lib/wordpress/types/entities/WPTerm";
import { cache } from "react";

const getCachedTermsByPathString = cache(async (taxonomy: string, pathString: string) => {
    return await wpResolveTermsFromPath(taxonomy, pathString.split(","));
});

export async function getTerms(taxonomy: string, termSlugPath: string[]): Promise<WPTerm[]> {
    return await getCachedTermsByPathString(taxonomy, termSlugPath.join(","));
}

export async function getMainTerm(taxonomy: string, termSlugPath: string[]): Promise<WPTerm | undefined> {
    const terms = await getCachedTermsByPathString(taxonomy, termSlugPath.join(","));
    return terms.find(term => term.slug === termSlugPath[termSlugPath.length - 1]);
}
