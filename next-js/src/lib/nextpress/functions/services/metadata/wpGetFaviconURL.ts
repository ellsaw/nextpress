import wpGetAttachment from "../wpGetAttachment";
import wpGetOption from "../wpGetOption";

export default async function wpGetFaviconURL(): Promise<string|undefined> {
    const iconID = await wpGetOption('site_icon');
    if (!iconID) return undefined;

    const iconMediaPost = await wpGetAttachment(Number(iconID));

    return iconMediaPost?.guid;
}
