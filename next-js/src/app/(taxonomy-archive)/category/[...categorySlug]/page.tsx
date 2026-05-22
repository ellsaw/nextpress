import Archive from "@/components/Archive/Archive";
import { CategoryProps } from "../layout";
import { notFound } from "next/navigation";
import wpResolveTermsFromPath from "@/lib/wordpress/functions/services/resolvepath/wpResolveTermsFromPath";

export default async function CategoryPage({ params, searchParams }: CategoryProps) {
    const categoryPathSlugs = (await params).categorySlug;
    const page = (await searchParams).page;

    const categories = await wpResolveTermsFromPath('category', categoryPathSlugs);
    if (categories.length === 0) notFound();

    return (
        <>
        <h1>Test</h1>
        <Archive page={Number(page) || 1} taxonomy="category" terms={categories.map(c => c.termId)}></Archive>
        </>
    )
}
