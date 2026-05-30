import { cache } from "react";
import { MetadataResult, RouteProps, TemplateResult } from "../types";
import wpGetUser from "@/lib/nextpress/wordpress/services/wpGetUser";
import { getPageNumber } from "../helpers";
import { AuthorMetadata, AuthorTemplate } from "@/lib/nextpress/wordpress/template-heirarchy/archive/author";
import wpGetPostPage from "@/lib/nextpress/wordpress/services/wpGetPostPage";
import { notFound } from "next/navigation";

const getUser = cache(async (login: string) => {
    return await wpGetUser({login});
});

const getPostPage = cache(async (author: number, page: number) => {
    return await wpGetPostPage({author, page});
});

export function AuthorArchive(props: { path: string[], metadata: true }): Promise<MetadataResult>;
export function AuthorArchive(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

export async function AuthorArchive({ path, metadata = false }: RouteProps) {
    const page = getPageNumber(path) || 1;

    const user = await getUser(path[1] ?? '');
    if (!user) notFound();

    const posts = await getPostPage(user?.ID ?? 0, page);

    return metadata ? AuthorMetadata({user, ...posts}) : <AuthorTemplate user={user} {...posts} />;
}
