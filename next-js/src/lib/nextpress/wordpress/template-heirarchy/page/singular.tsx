import { WPSingularQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { IndexMetadata, IndexTemplate } from "..";

export async function SingularMetadata(queriedObject: WPSingularQueriedObject): Promise<Metadata> {
    const metadata = await wpLoadMetadata('Singular', queriedObject);
    return {...(await IndexMetadata({posts: [queriedObject.post]})), ...metadata}
}

export async function SingularTemplate(queriedObject: WPSingularQueriedObject): Promise<JSX.Element> {
    const Singular = await wpLoadTemplate('Singular');
    if (!Singular) return <IndexTemplate {...{posts: [queriedObject.post]}} />

    return <Singular {...queriedObject} />;
}
