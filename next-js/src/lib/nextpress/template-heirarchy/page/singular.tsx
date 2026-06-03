import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { IndexMetadata, IndexTemplate } from "..";

export async function SingularMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Singular');
    return {...(await IndexMetadata()), ...metadata}
}

export async function SingularTemplate(): Promise<JSX.Element> {
    const Singular = await loadTemplate('Singular');
    if (!Singular) return <IndexTemplate/>

    return <Singular {...queriedObject} />;
}
