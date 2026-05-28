import { WPTermQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

export async function TaxonomyMetadata(queriedObject: WPTermQueriedObject): Promise<Metadata> {
    const metadata = await wpLoadMetadata('Taxonomy', queriedObject);
    return {...(await ArchiveMetadata(queriedObject)), ...metadata};
}

export async function TaxonomyTemplate(queriedObject: WPTermQueriedObject): Promise<JSX.Element> {
    const Taxonomy = await wpLoadTemplate('Taxonomy');
    if (!Taxonomy) return <ArchiveTemplate {...queriedObject} />

    return <Taxonomy {...queriedObject} />;
}
