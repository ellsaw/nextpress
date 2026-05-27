import Archive from "@/components/Archive/Archive";
import { notFound } from "next/navigation";
import wpGetAllTerms from "@/lib/nextpress/functions/services/wordpress/wpGetAllTerms";
import { getMainTerm, getTerms } from "../../data";
import { Metadata } from "next";
import wpGetBlogname from "@/lib/nextpress/functions/services/wordpress/metadata/wpGetBlogname";

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

export async function generateMetadata({ params }: CategoryProps): Promise<Metadata> {
    const categorySlugPath = (await params).categorySlug;
    const blogname = await wpGetBlogname();

    const category = await getMainTerm('category', categorySlugPath);

    return {
        title: category ? `${category.name} – ${blogname}` : blogname,
        description: category?.description || '',
    }
}

export default async function CategoryPage({ params, searchParams }: CategoryProps) {
    const categorySlugPath = (await params).categorySlug;
    const page = (await searchParams).page ?? 1;

    const mainCategory = await getMainTerm('category', categorySlugPath);
    if (!mainCategory) notFound();

    const title = mainCategory.name;

    const categories = await getTerms('category', categorySlugPath);

    return (
        <>
        <Archive title={title} page={Number(page)} taxonomy="category" terms={categories.map(c => c.termId)}></Archive>
        </>
    )
}
