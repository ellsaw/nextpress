import wpGetDateTimeFormatter from "@/lib/nextpress/functions/utilities/wpGetDateTimeFormatter";
import wpGetPostPage from "@/lib/nextpress/functions/services/wpGetPostPage";
import Link from "next/link";
import PaginationControls from "../parts/PaginationControls/PaginationControls";

type Props = {
    title: string
    page: number,
    taxonomy?: string,
    terms?: number[],
    author?: number
}

export default async function Archive({ title, page, terms, author }: Props) {
    const postPage = await wpGetPostPage(page, terms, author);
    const dateTimeFormatter = await wpGetDateTimeFormatter();

    return (
        <>
        <h2 className="text-3xl">{title}</h2>
        <ul className="flex flex-col gap-4">
            {postPage.posts.map((post) => (
                <li key={post.ID}>
                    <Link href={post.path || ''}>
                        <h2>{post.postTitle}</h2>
                        <p>{post.postContent}</p>
                        <time dateTime={post.postDate.toISOString()}>{dateTimeFormatter.format(post.postDate)}</time>
                    </Link>
                </li>
            ))}
        </ul>
        {postPage.availablePages > 1 && <PaginationControls page={page} availablePages={postPage.availablePages}/>}
        </>
    )
}
