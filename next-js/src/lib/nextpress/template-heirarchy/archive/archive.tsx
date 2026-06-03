import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { IndexMetadata, IndexTemplate } from "..";

export async function ArchiveMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Archive');
    return {...(await IndexMetadata()), ...metadata};
}

export async function ArchiveTemplate(): Promise<JSX.Element> {
    const Archive = await loadTemplate('Archive');
    if (!Archive) return <IndexTemplate/>

    return <Archive/>;
}
