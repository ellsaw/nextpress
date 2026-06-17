import { IPost } from "@/lib/nextpress/entities/post/post.interface";
import getDateTimeFormatter from "@/lib/nextpress/services/utilities/get-date-time-formatter";
import getTheExcerpt from "@/lib/nextpress/services/utilities/get-the-excerpt";
import RenderAttachmentImage from "@/lib/nextpress/ui/render-attachment-image";
import Link from "next/link";

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
                        {getTheExcerpt(post)}
                    </div>
                </div>
            </Link>
        </li>
    )
}
