import WPGetOption from "../core/WPGetOption";
import WPGetPost from "../core/WPGetPost";

export default async function WPGetFaviconURL(): Promise<string|undefined> {
    const iconID = await WPGetOption('site_icon') as number|undefined ?? 0;
    if (!iconID) return undefined;

    const iconMediaPost = await WPGetPost('ID', iconID);
    return iconMediaPost?.guid;
}