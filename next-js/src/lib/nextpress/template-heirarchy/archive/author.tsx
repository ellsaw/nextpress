import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

export async function AuthorMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Author');
    return {...(await ArchiveMetadata()), ...metadata};
}

export async function AuthorTemplate(): Promise<JSX.Element> {
    const Author = await loadTemplate('Author');
    if (!Author) return <ArchiveTemplate/>

    return <Author/>;
}
