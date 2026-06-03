import { unserialize } from "php-serialize";
import getOption from "./get-option";

export default async function getThemeMods(key: string): Promise<unknown | undefined> {
    const themeModOption = await getOption('theme_mods_nextpress_theme');

    const themeMods: Record<string, unknown> | unknown[] = unserialize(themeModOption ?? 'a:0:{}');
    if (Array.isArray(themeMods)) return;

    return themeMods[key];
}
