import { notFound } from "next/navigation";
import wpGetAllPosts from "@/lib/nextpress/functions/services/wpGetAllPosts";
import { Metadata } from "next";
import wpGetBlogname from "@/lib/nextpress/functions/services/metadata/wpGetBlogname";
import { getPost } from "../data";

interface PostProps {
    params: Promise<{ postName: string[] }>;
}

export async function generateStaticParams() {
    const posts = await wpGetAllPosts();

    return posts.map((post) => ({
        postName: [post.postName]
    }));
}

export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
    const postPathSlugs = (await params).postName;
    const blogname = await wpGetBlogname();

    const post = await getPost(postPathSlugs);

    return {
        title: post ? `${post.postTitle} – ${blogname}` : blogname,
        description: post?.postExcerpt || '',
    }
}

export default async function Page({params}: PostProps){
    const postPathSlugs = (await params).postName;

    const post = await getPost(postPathSlugs);
    if (!post) notFound();

    return (
        <>
        <h1>{ post.postTitle }</h1>
        </>
    )
}
