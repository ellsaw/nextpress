import { WPQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { IndexMetadata, IndexTemplate } from "..";

export async function HomeMetadata(queriedObject: WPQueriedObject): Promise<Metadata> {
    const metadata = await wpLoadMetadata('Home', queriedObject);
    return {...(await IndexMetadata(queriedObject)), ...metadata};
}

export async function HomeTemplate(queriedObject: WPQueriedObject): Promise<JSX.Element> {
    const Home = await wpLoadTemplate('Home');
    if (!Home) return <IndexTemplate {...queriedObject} />

    return <Home {...queriedObject} />;
}
