import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

export async function TagMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Tag');
    return {...(await ArchiveMetadata()), ...metadata};
}

export async function TagTemplate(): Promise<JSX.Element> {
    const Category = await loadTemplate('Tag');
    if (!Category) return <ArchiveTemplate/>

    return <Category/>;
}


