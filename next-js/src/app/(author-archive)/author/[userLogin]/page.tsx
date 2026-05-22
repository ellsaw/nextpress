import Archive from "@/components/Archive/Archive";
import { notFound } from "next/navigation";
import wpGetUser from "@/lib/wordpress/functions/services/wpGetUser";
import wpGetAllUsers from "@/lib/wordpress/functions/services/wpGetAllUsers";

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

export default async function AuthorPage({ params, searchParams }: AuthorProps) {
    const userLogin = (await params).userLogin;
    const page = (await searchParams).page;

    const user = await wpGetUser(undefined, userLogin);
    if (!user) notFound();

    return (
        <>
        <Archive title={user.displayName} page={Number(page) || 1} author={user.ID}></Archive>
        </>
    )
}

