import WPOptionQuery from "./core/WPOptionQuery";

export default async function wpGetOption(optionName: string): Promise<string | undefined> {
    const options = await new WPOptionQuery().setName({optionName}).getOptions();
    if (options.length === 0) return;

    return options[0].optionValue;
}