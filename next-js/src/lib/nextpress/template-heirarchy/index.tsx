import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "./_autoloader/template-autoloader";

export async function IndexMetadata(): Promise<Metadata> {
    const metadata = await loadMetadata('Index');
    return metadata ?? {};
}

export async function IndexTemplate(): Promise<JSX.Element> {
    const Index = await loadTemplate('Index');
    if (!Index) {
        throw new Error('Nextpress needs an index.tsx file in the template heirarchy in the _templates directory to function');
    }

    return <Index/>;
}
