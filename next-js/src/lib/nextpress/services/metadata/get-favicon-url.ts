import getOption from "../get-option";
// import { getPost } from "../get-post";

export default async function getFaviconURL(): Promise<string|undefined> {
    const iconID = await getOption('site_icon');
    if (!iconID) return;

    const iconMediaPost = await getPost(Number(iconID));

    return iconMediaPost?.guid;
}
