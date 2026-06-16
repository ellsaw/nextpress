import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { getPageNumber } from "../helpers";
import { AuthorMetadata, AuthorTemplate } from "@/lib/nextpress/template-heirarchy/archive/author";
import { notFound } from "next/navigation";
import { queriedObjectState } from "@/lib/nextpress/globals/globals";

export function AuthorArchive(props: { path: string[], metadata: true }): Promise<MetadataResult>;
export function AuthorArchive(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

export async function AuthorArchive({ path, metadata = false }: RouteProps) {
    const postsPerPage = Number((await getOption('posts_per_page'))) ?? 10;

    const page = getPageNumber(path) || 1;

    const login = path[1];
    if (!login) notFound();

    const userQuery = await userLoader.findAndPrime({
        login: login,
        multiple: false,
        noFoundRows: true
    });

    const user = await getUser(userQuery.ids[0] ?? 0)
    if (!user) notFound();

    const postIds = await postLoader.findAndPrime({
        authorId: user.ID,
        noFoundRows: false,
        noPaging: false,
        postType: 'post',
        page: page,
        postsPerPage: postsPerPage,
        postStatus: 'publish',
        orderBy: 'date'
    });

    const currentQueriedObject = {
        objectType: 'user',
        posts: postIds.ids,
        page,
        pageCount: Math.ceil(postIds.count / postsPerPage),
        user: user.ID
    }

    const state = queriedObjectState();
    state.currentState = currentQueriedObject;

    return metadata ? await AuthorMetadata() : <AuthorTemplate/>;
}
