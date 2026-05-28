import { Metadata } from "next";
import { JSX } from "react";
import { WPQueriedObject } from "../../types/common/WPQueriedObject";
import { wpLoadMetadata, wpLoadTemplate } from "./_autoloader/wpLoadTemplate";

export async function IndexMetadata(queriedObject: WPQueriedObject): Promise<Metadata> {
    const metadata = await wpLoadMetadata('Index', queriedObject);
    return metadata ?? {};
}

export async function IndexTemplate(queriedObject: WPQueriedObject): Promise<JSX.Element> {
    const Index = await wpLoadTemplate('Index');
    if (!Index) {
        throw new Error('Nextpress needs an index.tsx file in the template heirarchy in the _templates directory to function');
    }

    return <Index {...queriedObject} />;
}
