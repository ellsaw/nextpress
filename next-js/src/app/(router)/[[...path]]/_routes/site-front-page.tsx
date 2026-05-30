import wpGetHomepage from "@/lib/nextpress/wordpress/services/wpGetHomepage";
import { PageMetadata, PageTemplate } from "@/lib/nextpress/wordpress/template-heirarchy/page/page";
import { cache } from "react";
import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { PostIndexPage } from "./post-index-page";

const getHomepage = cache(async() => await wpGetHomepage());

export function SiteFrontPage(props: { path: string[], metadata: true }): Promise<MetadataResult>;
export function SiteFrontPage(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

export async function SiteFrontPage({ path, metadata = false }: RouteProps) {
    const homepage = await getHomepage();

    if (homepage) {
        return metadata ? PageMetadata({post: homepage}) : <PageTemplate post={homepage}/>;
    } else {
        return metadata ? PostIndexPage({path, metadata: true}) : <PostIndexPage path={path}/>
    }
}
