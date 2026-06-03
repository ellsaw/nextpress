import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { SingularMetadata, SingularTemplate } from "./singular";

export async function PageMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Page');
    return {...(await SingularMetadata()), ...metadata};
}

export async function PageTemplate(): Promise<JSX.Element> {
    const Page = await loadTemplate('Page');
    if (!Page) return <SingularTemplate/>

    return <Page/>;
}
