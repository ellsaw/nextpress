import Link from "next/link";
import { IPost } from "nextpress/entities/post/post.interface";
import { getDateTimeFormatter } from "nextpress/services/utilities/get-date-time-formatter";
import { RenderAttachmentImage } from "nextpress/ui/render-attachment-image";

export default async function ArchiveArticle({ post }: { post: IPost }) {
    const dateTimeFormatter = await getDateTimeFormatter();

    return (
        <li className="sm:h-48">
            <Link href={post.path || ''} className="group flex flex-col sm:flex-row gap-2 sm:gap-6 h-full w-full">
                <div className="shrink-0 h-full aspect-video rounded-xl overflow-hidden">
                    {!!post.thumbnailId &&
                        <RenderAttachmentImage
                            attachmentId={post.thumbnailId}
                            className="w-full h-full object-cover"
                            sizes="(max-width: 640px) 100vw, 21.3rem"
                            />
                        }
                </div>
                <div>
                    <time dateTime={post.postDate.toISOString()} className="opacity-75">{dateTimeFormatter.format(post.postDate)}</time>
                    <h2 className="text-2xl group-hover:underline">{post.postTitle}</h2>
                    <div className="wysiwyg-content">
                        {post.postExcerpt}
                    </div>
                </div>
            </Link>
        </li>
    )
}
