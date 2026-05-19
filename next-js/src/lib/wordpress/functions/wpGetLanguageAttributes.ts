import wpGetOption from "./wpGetOption";

export default async function wpGetLanguageAttributes(): Promise<string> {
    const wplang = await wpGetOption('WPLANG');
    return wplang ?? 'en_US';
}