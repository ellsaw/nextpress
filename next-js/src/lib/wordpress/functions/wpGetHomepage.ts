import { Selectable } from "kysely";
import { WpPost } from "../types/wpdb/wpdb";
import wpGetOption from "./wpGetOption";
import wpGetPost from "./wpGetPost";

export default async function wpGetHomepage(): Promise<Selectable<WpPost> | undefined> {
    const homepageID = await wpGetOption('page_on_front');
    if (!homepageID) return undefined;

    return await wpGetPost(Number(homepageID.optionValue));
}