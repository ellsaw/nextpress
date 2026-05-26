import wpGetPostPage from "@/lib/nextpress/functions/services/wpGetPostPage";
import PaginationControls from "../parts/PaginationControls/PaginationControls";
import Link from "next/link";
import wpGetDateTimeFormatter from "@/lib/nextpress/functions/utilities/wpGetDateTimeFormatter";
import WPAttachmentImage from "@/lib/nextpress/ui/WPAttachmentImage/WPRenderAttachmentImage";
import wpGetTheExcerpt from "@/lib/nextpress/functions/utilities/wpGetTheExcerpt";

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
        <div className="my-8">
            <h2 className="text-3xl mb-8">{title}</h2>
            <ul className="flex flex-col gap-8">
                {postPage.posts.map((post) => (
                    <li key={post.ID} className="h-48">
                        <Link href={post.path || ''} className="group flex gap-6 h-full w-full">
                            <div className="shrink-0 h-full aspect-video rounded-xl overflow-hidden">
                                {post.thumbnail && <WPAttachmentImage attachmentImage={post.thumbnail} className="w-full h-full object-cover"/>}
                            </div>
                            <div>
                                <time dateTime={post.postDate.toISOString()} className="opacity-75">{dateTimeFormatter.format(post.postDate)}</time>
                                <h2 className="text-2xl group-hover:underline">{post.postTitle}</h2>
                                <div className="wysiwyg-content">
                                    {wpGetTheExcerpt(post)}
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            {postPage.availablePages > 1 && <PaginationControls page={page} availablePages={postPage.availablePages}/>}
        </div>
    )
}
