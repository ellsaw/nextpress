import Archive from "@/components/Archive/Archive";
import { notFound } from "next/navigation";
import wpResolveTermsFromPath from "@/lib/wordpress/functions/services/resolvepath/wpResolveTermsFromPath";
import wpGetAllTerms from "@/lib/wordpress/functions/services/wpGetAllTerms";

interface TagProps {
    params: Promise<{ tagSlug: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
    const tags = await wpGetAllTerms(['post_tag']);

    return tags.map((tag) => ({
        tagSlug: [tag.slug]
    }));
}

export default async function TagPage({ params, searchParams }: TagProps) {
    const tagPathSlugs = (await params).tagSlug;
    const page = (await searchParams).page ?? 1;

    const tags = await wpResolveTermsFromPath('post_tag', tagPathSlugs);
    if (tags.length === 0) notFound();

    const mainTag = tags.find(category => category.slug === tagPathSlugs[tagPathSlugs.length - 1]);
    const title = mainTag?.name || '';

    return (
        <>
        <Archive title={title} page={Number(page)} taxonomy="post_tag" terms={tags.map(c => c.termId)}></Archive>
        </>
    )
}

