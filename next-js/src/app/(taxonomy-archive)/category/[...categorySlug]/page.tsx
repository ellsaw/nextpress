import Archive from "@/components/Archive/Archive";
import { notFound } from "next/navigation";
import wpResolveTermsFromPath from "@/lib/wordpress/functions/services/resolvepath/wpResolveTermsFromPath";
import wpGetAllTerms from "@/lib/wordpress/functions/services/wpGetAllTerms";

interface CategoryProps {
    params: Promise<{ categorySlug: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
    const categories = await wpGetAllTerms(['category']);

    return categories.map((category) => ({
        categorySlug: [category.slug]
    }));
}

export default async function TagPage({ params, searchParams }: CategoryProps) {
    const categoryPathSlugs = (await params).categorySlug;
    const page = (await searchParams).page ?? 1;

    const categories = await wpResolveTermsFromPath('category', categoryPathSlugs);
    if (categories.length === 0) notFound();

    const mainCategory = categories.find(category => category.slug === categoryPathSlugs[categoryPathSlugs.length - 1]);
    const title = mainCategory?.name || '';

    return (
        <>
        <Archive title={title} page={Number(page)} taxonomy="category" terms={categories.map(c => c.termId)}></Archive>
        </>
    )
}
