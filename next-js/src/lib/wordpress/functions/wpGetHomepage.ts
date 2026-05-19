import { Selectable } from "kysely";
import { WpPost } from "../types/wpdb/wpdb";
import wpOptionQuery from "./core/wpOptionQuery";
import wpGetPost from "./wpGetPost";

export default async function wpGetHomepage(): Promise<Selectable<WpPost> | undefined> {
    const homepageID = await wpOptionQuery('page_on_front');
    if (!homepageID) return undefined;

    return await wpGetPost(Number(homepageID));
}