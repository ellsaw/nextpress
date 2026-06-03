import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { SingularMetadata, SingularTemplate } from "./singular";

export async function SingleMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Single');
    return {...(await SingularMetadata()), ...metadata};
}

export async function SingleTemplate(): Promise<JSX.Element> {
    const Single = await loadTemplate('Single');
    if (!Single) return <SingularTemplate/>

    return <Single/>;
}
