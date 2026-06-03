import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { ArchiveMetadata, ArchiveTemplate } from "./archive";
import capitalizeFirstLetter from "../../services/utilities/capitalise-first-letter";
import { QueriedObjectPage } from "../queried-object";

export async function PostTypeArchiveMetadata({postType}: {postType: string}): Promise<Metadata> {
    const metadata = await loadMetadata(capitalizeFirstLetter(postType));
    return {...(await ArchiveMetadata()), ...metadata};
}

export async function PostTypeArchiveTemplate({postType}: {postType: string}): Promise<JSX.Element> {
    const PostTypeArchive = await loadTemplate(capitalizeFirstLetter(postType));
    if (!PostTypeArchive) return <ArchiveTemplate/>

    return <PostTypeArchive/>;
}
