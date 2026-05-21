import WPOptionLoader from "./core/WPOptionLoader";

export default async function wpGetOption(optionName: string): Promise<string | undefined> {
    const option = await WPOptionLoader.instance().getOption(optionName);
    return option?.optionValue;
}
