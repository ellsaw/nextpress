import PaginationControls from "./pagination-controls/pagination-controls";
import ArchiveArticle from "./archive-article";

type Props = {
    title: string,
}

export default async function Archive({ title }: Props) {
    const posts = await getThePosts();
    const page = getThePage();
    const pageCount = getThePageCount();

    return (
        <div className="my-8 px-4">
            <h2 className="text-3xl mb-8">{title}</h2>
            <ul className="flex flex-col gap-8">
                {posts.map((post) => (
                    <ArchiveArticle key={post.ID} post={post}/>
                ))}
            </ul>
            {(pageCount ?? 0 > 1) && <PaginationControls page={page ?? 1} availablePages={pageCount ?? 0}/>}
        </div>
    )
}
