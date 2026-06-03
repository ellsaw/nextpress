import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

export async function TaxonomyMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Taxonomy');
    return {...(await ArchiveMetadata()), ...metadata};
}

export async function TaxonomyTemplate(): Promise<JSX.Element> {
    const Taxonomy = await loadTemplate('Taxonomy');
    if (!Taxonomy) return <ArchiveTemplate/>

    return <Taxonomy/>;
}
