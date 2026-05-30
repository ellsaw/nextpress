import { WPQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import wpGetBlogname from "@/lib/nextpress/wordpress/services/metadata/wpGetBlogname";
import wpGetFaviconURL from "@/lib/nextpress/wordpress/services/metadata/wpGetFaviconURL";
import { Metadata } from "next";

export async function IndexMetadata(queriedObject: WPQueriedObject): Promise<Metadata> {
    const [blogname, iconURL] = await Promise.all([
        wpGetBlogname(),
        wpGetFaviconURL()
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
