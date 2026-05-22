import Archive from "@/components/Archive/Archive";

type Props = {
    params: Promise<{ categorySlug: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ params, searchParams }: Props) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const categorySlug = resolvedParams.categorySlug;
    const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;

    return (
        <>
            <Archive page={page} terms={categorySlug[categorySlug.length - 1]}></Archive>
        </>
    )
}
