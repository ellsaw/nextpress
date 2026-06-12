import { PageMetadata, PageTemplate } from "@/lib/nextpress/template-heirarchy/page/page";
import { MetadataResult, RouteProps, TemplateResult } from "../types";
import { PostIndexPage } from "./post-index-page";
import { queriedObjectState } from "@/lib/nextpress/globals/globals";

export function SiteFrontPage(props: { path: string[], metadata: true }): Promise<MetadataResult>;
export function SiteFrontPage(props: { path: string[], metadata?: false }): Promise<TemplateResult>;

export async function SiteFrontPage({ path, metadata = false }: RouteProps) {
    const homepageId = Number(await getOption('page_on_front'));

    if (homepageId) {
        const currentQueriedObject = {
            posts: [homepageId]
        }

        const state = queriedObjectState();
        state.currentState = currentQueriedObject;

        return metadata ? await PageMetadata() : <PageTemplate/>;
    } else {
        return metadata ? await PostIndexPage({path, metadata: true}) : <PostIndexPage path={path}/>
    }
}
