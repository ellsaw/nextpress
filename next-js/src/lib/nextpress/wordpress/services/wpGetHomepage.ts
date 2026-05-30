import wpGetPage from "./wpGetPage";
import wpGetOption from "./wpGetOption";

export default async function wpGetHomepage() {
    const homepageID = Number(await wpGetOption('page_on_front'));
    if (!homepageID) return undefined;

    return await wpGetPage({ id: homepageID });
}
