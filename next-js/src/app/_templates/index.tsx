import { Metadata } from "next";
import { getBlogname } from "nextpress/services/metadata/get-blogname";
import { getFaviconURL } from "nextpress/services/metadata/get-favicon-url";

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
