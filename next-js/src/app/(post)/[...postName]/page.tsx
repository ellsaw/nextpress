import { notFound } from "next/navigation";
import { PostProps } from "../layout";
import wpResolvePostFromPath from "@/lib/wordpress/functions/services/resolvepath/wpResolvePostFromPath";

export default async function Page({params}: PostProps){
    const postPathSlugs = (await params).postName;
    const post = await wpResolvePostFromPath(postPathSlugs);
    if (!post) notFound();

    return (
        <>
        <h1>{ post.postTitle }</h1>
        </>
    )
}
