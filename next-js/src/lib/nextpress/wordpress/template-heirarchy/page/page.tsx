import { WPSingularQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { SingularMetadata, SingularTemplate } from "./singular";

export async function PageMetadata(queriedObject: WPSingularQueriedObject): Promise<Metadata> {
    const metadata = await wpLoadMetadata('Page', queriedObject);
    return {...(await SingularMetadata(queriedObject)), ...metadata};
}

export async function PageTemplate(queriedObject: WPSingularQueriedObject): Promise<JSX.Element> {
    const Page = await wpLoadTemplate('Page');
    if (!Page) return <SingularTemplate {...queriedObject} />

    return <Page {...queriedObject} />;
}
