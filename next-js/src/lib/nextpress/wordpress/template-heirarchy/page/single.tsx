import { WPSingleQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { SingularMetadata, SingularTemplate } from "./singular";

export async function SingleMetadata(queriedObject: WPSingleQueriedObject): Promise<Metadata> {
    const metadata = await wpLoadMetadata('Single', queriedObject);
    return {...(await SingularMetadata(queriedObject)), ...metadata};
}

export async function SingleTemplate(queriedObject: WPSingleQueriedObject): Promise<JSX.Element> {
    const Single = await wpLoadTemplate('Single');
    if (!Single) return <SingularTemplate {...queriedObject} />

    return <Single {...queriedObject} />;
}
