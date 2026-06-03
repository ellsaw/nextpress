import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { IndexMetadata, IndexTemplate } from "..";

export async function NotFoundMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('NotFound');
    return {...(await IndexMetadata()), ...metadata};
}

export async function NotFoundTemplate(): Promise<JSX.Element> {
    const NotFound = await loadTemplate('NotFound');
    if (!NotFound) return <IndexTemplate/>

    return <NotFound/>;
}
