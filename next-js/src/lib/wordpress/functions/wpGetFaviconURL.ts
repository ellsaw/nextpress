import wpGetOption from "./wpGetOption";
import wpGetPost from "./wpGetPost";

export default async function wpGetFaviconURL(): Promise<string|undefined> {
    const iconID = await wpGetOption('site_icon');
    if (!iconID) return undefined;

    const iconMediaPost = await wpGetPost(Number(iconID));    

    return iconMediaPost?.guid;
}