import wpGetAllPosts from "@/lib/wordpress/functions/services/wpGetAllPosts";

export interface PostProps {
    params: Promise<{ postName: string[] }>;
}

export async function generateStaticParams() {
    const posts = await wpGetAllPosts();

    return posts.map((post) => ({
        postName: [post.postName]
    }));
}

export default async function PostLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <>
        {children}
        </>
    );
}
