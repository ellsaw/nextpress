import Archive from "@/components/Archive/Archive";
import { notFound } from "next/navigation";
import wpGetAllTerms from "@/lib/nextpress/functions/services/wordpress/wpGetAllTerms";
import { getMainTerm, getTerms } from "../../data";
import { Metadata } from "next";
import wpGetBlogname from "@/lib/nextpress/functions/services/wordpress/metadata/wpGetBlogname";

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

export async function generateMetadata({ params }: TagProps): Promise<Metadata> {
    const tagSlugPath = (await params).tagSlug;
    const blogname = await wpGetBlogname();

    const tag = await getMainTerm('post_tag', tagSlugPath);

    return {
        title: tag ? `${tag.name} – ${blogname}` : blogname,
        description: tag?.description || '',
    }
}

export default async function TagPage({ params, searchParams }: TagProps) {
    const tagSlugPath = (await params).tagSlug;
    const page = (await searchParams).page ?? 1;

    const mainTag = await getMainTerm('post_tag', tagSlugPath);
    if (!mainTag) notFound();

    const title = mainTag.name;

    const tags = await getTerms('post_tag', tagSlugPath);

    return (
        <>
        <Archive title={title} page={Number(page)} taxonomy="post_tag" terms={tags.map(c => c.termId)}></Archive>
        </>
    )
}

