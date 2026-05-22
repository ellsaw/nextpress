import wpGetDateTimeFormatter from "@/lib/wordpress/functions/utilities/wpGetDateTimeFormatter";
import wpGetPostPage from "@/lib/wordpress/functions/services/wpGetPostPage";

type Props = {
    title: string
    page: number,
    taxonomy?: string,
    terms?: number[],
    author?: number
}
export default async function Archive({ title, page, terms, author }: Props) {
    const posts = await wpGetPostPage(page, terms, author);
    const dateTimeFormatter = await wpGetDateTimeFormatter();

    return (
        <>
        <h2>{title}</h2>
        <ul>
            {posts.map((post) => (
                <li key={post.ID}>
                    <h2>{post.postTitle}</h2>
                    <time dateTime={post.postDate.toISOString()}>{dateTimeFormatter.format(post.postDate)}</time>
                    <p>{post.postContent}</p>
                </li>
            ))}
        </ul>
        </>
    )
}
