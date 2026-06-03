import getBlogname from "@/lib/nextpress/services/metadata/get-blogname";
import getFaviconURL from "@/lib/nextpress/services/metadata/get-favicon-url";
import { QueriedObjectPage } from "@/lib/nextpress/template-heirarchy/queried-object";
import { Metadata } from "next";

export async function IndexMetadata(): Promise<Metadata> {
    const [blogname, iconURL] = await Promise.all([
        getBlogname(),
        getFaviconURL()
    ]);

    return {
        title: blogname,
        description: 'Test fallback',
        icons: {
            icon: iconURL
        }
    }
}

export async function IndexTemplate() {
    return <></>
}
