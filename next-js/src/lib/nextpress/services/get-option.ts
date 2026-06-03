import OptionLoader from "../repository/option-loader/option-loader";

export default async function getOption(optionName: string): Promise<string | undefined> {
    const option = await OptionLoader.instance().getOption(optionName);
    return option?.optionValue;
}
