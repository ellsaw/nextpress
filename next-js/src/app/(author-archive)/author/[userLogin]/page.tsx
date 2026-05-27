import Archive from "@/components/Archive/Archive";
import { notFound } from "next/navigation";
import wpGetAllUsers from "@/lib/nextpress/functions/services/wordpress/wpGetAllUsers";
import { getUser } from "../data";
import wpGetBlogname from "@/lib/nextpress/functions/services/wordpress/metadata/wpGetBlogname";
import { Metadata } from "next";

interface AuthorProps {
    params: Promise<{ userLogin: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateStaticParams() {
    const users = await wpGetAllUsers();

    return users.map((user) => ({
        userLogin: user.userLogin
    }));
}

export async function generateMetadata({ params }: AuthorProps): Promise<Metadata> {
    const userLogin = (await params).userLogin;
    const blogname = await wpGetBlogname();

    const user = await getUser(userLogin);

    return {
        title: user ? `${user.displayName} – ${blogname}` : blogname
    }
}

export default async function AuthorPage({ params, searchParams }: AuthorProps) {
    const userLogin = (await params).userLogin;
    const page = (await searchParams).page;

    const user = await getUser(userLogin);
    if (!user) notFound();

    return (
        <>
        <Archive title={user.displayName} page={Number(page) || 1} author={user.ID}></Archive>
        </>
    )
}

