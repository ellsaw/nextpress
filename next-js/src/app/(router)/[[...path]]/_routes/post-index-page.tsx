import { HomeMetadata, HomeTemplate } from "@/lib/nextpress/wordpress/template-heirarchy/home/home";
import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { getPageNumber } from "../helpers";
import { cache } from "react";
import wpGetPostPage from "@/lib/nextpress/wordpress/services/wpGetPostPage";

const getPostPage = cache(async(page: number) => await wpGetPostPage({page}))

export function PostIndexPage(props: { path: string[], metadata: true }): Promise<MetadataResult>;
export function PostIndexPage(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

export async function PostIndexPage({ path, metadata = false }: RouteProps) {
    const page = getPageNumber(path) || 1;
    const posts = await getPostPage(page);
    return metadata ? HomeMetadata({...posts}) : <HomeTemplate {...posts}/>;
}

