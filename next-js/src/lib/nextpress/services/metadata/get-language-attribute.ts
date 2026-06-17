export default async function wpGetLanguageAttributes(): Promise<string> {
    const wplang = await getOption('WPLANG');
    return wplang || 'en_US';
}
