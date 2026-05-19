import wpOptionQuery from "./core/wpOptionQuery";

export default async function wpGetLanguageAttributes(): Promise<string> {
    const wplang = await wpOptionQuery('WPLANG');
    return wplang ?? 'en_US';
}