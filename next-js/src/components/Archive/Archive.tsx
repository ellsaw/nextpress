import wpGetPostPage from "@/lib/nextpress/functions/services/wpGetPostPage";
import PaginationControls from "../parts/PaginationControls/PaginationControls";
import Post from "./Post";

type Props = {
    title: string
    page: number,
    taxonomy?: string,
    terms?: number[],
    author?: number
}

export default async function Archive({ title, page, terms, author }: Props) {
    const postPage = await wpGetPostPage(page, terms, author);

    return (
        <>
        <h2 className="text-3xl">{title}</h2>
        <ul className="flex flex-col gap-4">
            {postPage.posts.map((post) => (
                <Post key={post.ID} post={post}/>
            ))}
        </ul>
        {postPage.availablePages > 1 && <PaginationControls page={page} availablePages={postPage.availablePages}/>}
        </>
    )
}
