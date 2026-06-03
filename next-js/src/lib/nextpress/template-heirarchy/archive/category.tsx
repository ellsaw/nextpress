import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";

export async function CategoryMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Category');
    return {...(await ArchiveMetadata()), ...metadata};
}

export async function CategoryTemplate(): Promise<JSX.Element> {
    const Category = await loadTemplate('Category');
    if (!Category) return <ArchiveTemplate/>

    return <Category/>;
}

