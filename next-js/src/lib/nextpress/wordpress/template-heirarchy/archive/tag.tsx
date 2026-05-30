import { WPTermQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

export async function TagMetadata(queriedObject: WPTermQueriedObject): Promise<Metadata> {
    const metadata = await wpLoadMetadata('Tag', queriedObject);
    return {...(await ArchiveMetadata(queriedObject)), ...metadata};
}

export async function TagTemplate(queriedObject: WPTermQueriedObject): Promise<JSX.Element> {
    const Category = await wpLoadTemplate('Tag');
    if (!Category) return <ArchiveTemplate {...queriedObject} />

    return <Category {...queriedObject} />;
}


