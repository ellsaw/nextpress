import { WPQueriedObject } from "@/lib/nextpress/types/common/WPQueriedObject";
import { Metadata } from "next";
import { JSX } from "react";
import { wpLoadMetadata, wpLoadTemplate } from "../_autoloader/wpLoadTemplate";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";
import capitalizeFirstLetter from "../../utilities/capitaliseFirstLetter";

export async function PostTypeArchiveMetadata({postType, ...queriedObject}: WPQueriedObject & {postType: string}): Promise<Metadata> {
    const metadata = await wpLoadMetadata(capitalizeFirstLetter(postType), queriedObject);
    return {...(await ArchiveMetadata(queriedObject)), ...metadata};
}

export async function PostTypeArchiveTemplate({postType, ...queriedObject}: WPQueriedObject & {postType: string}): Promise<JSX.Element> {
    const PostTypeArchive = await wpLoadTemplate(capitalizeFirstLetter(postType));
    if (!PostTypeArchive) return <ArchiveTemplate {...queriedObject} />

    return <PostTypeArchive {...queriedObject} />;
}
