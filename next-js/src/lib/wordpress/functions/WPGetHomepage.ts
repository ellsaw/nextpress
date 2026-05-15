import WPGetOption from "../core/WPGetOption";
import WPGetPost from "../core/WPGetPost";

export default async function WPGetHomepage(): Promise<WPPost|undefined> {
    const homepageID = await WPGetOption('page_on_front') as number|undefined ?? 0;
    if (!homepageID) return undefined;

    return await WPGetPost('ID', homepageID);
}