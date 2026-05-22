import { WPPost } from "../../types/entities/WPPost";
import wpGetPost from "./wpGetPost";
import wpGetOption from "./wpGetOption";

export default async function wpGetHomepage(): Promise<WPPost | undefined> {
    const homepageID = await wpGetOption('page_on_front');
    if (!homepageID) return undefined;

    return await wpGetPost(Number(homepageID));
}
