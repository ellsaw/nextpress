import wpGetAllTerms from "@/lib/wordpress/functions/services/wpGetAllTerms";

export interface CategoryProps {
    params: Promise<{ categorySlug: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
    const categories = await wpGetAllTerms(['category']);

    return categories.map((category) => ({
        categorySlug: [category.slug]
    }));
}

export default async function CategoryArchiveLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <>
        {children}
        </>
    );
}

