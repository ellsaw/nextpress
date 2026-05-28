import { WPArchiveQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { IndexMetadata, IndexTemplate } from "..";

export async function ArchiveMetadata(queriedObject: WPArchiveQueriedObject): Promise<Metadata> {
    const metadata = await wpLoadMetadata('Archive', queriedObject);
    return {...(await IndexMetadata(queriedObject)), ...metadata};
}

export async function ArchiveTemplate(queriedObject: WPArchiveQueriedObject): Promise<JSX.Element> {
    const Archive = await wpLoadTemplate('Archive');
    if (!Archive) return <IndexTemplate {...queriedObject} />

    return <Archive {...queriedObject} />;
}
