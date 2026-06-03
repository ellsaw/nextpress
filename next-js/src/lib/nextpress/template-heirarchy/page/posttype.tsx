import { Metadata } from "next";
import { JSX } from "react";
import { loadMetadata, loadTemplate } from "../_autoloader/template-autoloader";
import { SingularMetadata, SingularTemplate } from "./singular";
import capitalizeFirstLetter from "../../services/utilities/capitalise-first-letter";

export async function PostTypeMetadata({postType}: {postType: string}): Promise<Metadata> {
    const metadata = await loadMetadata(capitalizeFirstLetter(postType));
    return {...(await SingularMetadata()), ...metadata};
}

export async function PostTypeTemplate({postType}: {postType: string}): Promise<JSX.Element> {
    const PostType = await loadTemplate(capitalizeFirstLetter(postType));
    if (!PostType) return <SingularTemplate/>

    return <PostType/>;
}

