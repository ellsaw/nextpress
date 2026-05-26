import wpGetDateTimeFormatter from "@/lib/nextpress/functions/utilities/wpGetDateTimeFormatter"
import wpKsesPost from "@/lib/nextpress/functions/utilities/wpKsesPost"
import { WPPost } from "@/lib/nextpress/types/entities/WPPost"
import Link from "next/link"
import WPAttachmentImage from "../../lib/nextpress/ui/WPAttachmentImage/WPAttachmentImage"

type Props = {
    post: WPPost
}
export default async function Post({ post }: Props) {
    const dateTimeFormatter = await wpGetDateTimeFormatter();

    return(
        <li>
            <Link href={post.path || ''}>
                <div>
                    {post.thumbnail && <WPAttachmentImage attachment={post.thumbnail} quality={50}/>}
                </div>
                <div>
                    <h2>{post.postTitle}</h2>
                    <div className="wysiwyg-content">
                        {wpKsesPost(post.postContent)}
                    </div>
                    <time dateTime={post.postDate.toISOString()}>{dateTimeFormatter.format(post.postDate)}</time>
                </div>
            </Link>
        </li>
    )
}
