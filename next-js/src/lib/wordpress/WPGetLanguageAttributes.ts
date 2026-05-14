import WPGetOption from "./core/WPGetOption";

export default async function WPGetLanguageAttributes(): Promise<string> {
    return await WPGetOption('WPLANG') as string|undefined ?? 'en_US';
}