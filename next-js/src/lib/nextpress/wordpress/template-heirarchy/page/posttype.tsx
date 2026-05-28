import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { SingularMetadata, SingularTemplate } from "./singular";
import capitalizeFirstLetter from "../../utilities/capitaliseFirstLetter";
import { WPSingularQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";

export async function PostTypeMetadata({postType, ...queriedObject}: WPSingularQueriedObject & {postType: string}): Promise<Metadata> {
    const metadata = await wpLoadMetadata(capitalizeFirstLetter(postType), queriedObject);
    return {...(await SingularMetadata(queriedObject)), ...metadata};
}

export async function PostTypeTemplate({postType, ...queriedObject}: WPSingularQueriedObject & {postType: string}): Promise<JSX.Element> {
    const PostType = await wpLoadTemplate(capitalizeFirstLetter(postType));
    if (!PostType) return <SingularTemplate {...queriedObject} />

    return <PostType {...queriedObject} />;
}

