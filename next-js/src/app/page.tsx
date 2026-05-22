import Archive from "@/components/Archive/Archive";
import wpGetBlogname from "@/lib/wordpress/functions/services/metadata/wpGetBlogname";
import wpGetHomepage from "@/lib/wordpress/functions/services/wpGetHomepage";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: Props) {
    const title = await wpGetBlogname();
    const post = await wpGetHomepage();

    if (post) {
        return (
            <>
            <h1>{ post.postTitle }</h1>
            </>
        )
    } else {
        const page = (await searchParams).page ?? 1;

        return (
            <>
                <Archive title={title} page={Number(page)}></Archive>
            </>
        )
    }
}
