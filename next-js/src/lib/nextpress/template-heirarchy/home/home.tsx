import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { IndexMetadata, IndexTemplate } from "..";

export async function HomeMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Home');
    return {...(await IndexMetadata()), ...metadata};
}

export async function HomeTemplate(): Promise<JSX.Element> {
    const Home = await loadTemplate('Home');
    if (!Home) return <IndexTemplate/>

    return <Home/>;
}
