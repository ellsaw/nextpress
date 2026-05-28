import { WPAuthorQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

export async function AuthorMetadata(queriedObject: WPAuthorQueriedObject): Promise<Metadata> {
    const metadata = await wpLoadMetadata('Author', queriedObject);
    return {...(await ArchiveMetadata(queriedObject)), ...metadata};
}

export async function AuthorTemplate(queriedObject: WPAuthorQueriedObject): Promise<JSX.Element> {
    const Author = await wpLoadTemplate('Author');
    if (!Author) return <ArchiveTemplate {...queriedObject} />

    return <Author {...queriedObject} />;
}
