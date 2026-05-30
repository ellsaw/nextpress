import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { IndexMetadata, IndexTemplate } from "..";

export async function NotFoundMetadata(): Promise<Metadata> {
    const metadata = await wpLoadMetadata('NotFound');
    return {...(await IndexMetadata({posts: []})), ...metadata};
}

export async function NotFoundTemplate(): Promise<JSX.Element> {
    const NotFound = await wpLoadTemplate('NotFound');
    if (!NotFound) return <IndexTemplate {...{posts: []}} />

    return <NotFound/>;
}
