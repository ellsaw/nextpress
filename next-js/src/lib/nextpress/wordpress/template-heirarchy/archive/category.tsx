import { WPTermQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

export async function CategoryMetadata(queriedObject: WPTermQueriedObject): Promise<Metadata> {
    const metadata = await wpLoadMetadata('Category', queriedObject);
    return {...(await ArchiveMetadata(queriedObject)), ...metadata};
}

export async function CategoryTemplate(queriedObject: WPTermQueriedObject): Promise<JSX.Element> {
    const Category = await wpLoadTemplate('Category');
    if (!Category) return <ArchiveTemplate {...queriedObject} />

    return <Category {...queriedObject} />;
}

