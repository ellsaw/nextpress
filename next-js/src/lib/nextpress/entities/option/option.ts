import wpdb from "../../wpdb/wpdb";
import { IOption } from "./option.interface";

export default class Option implements IOption
{
    constructor(public optionId: number) {};

    private optionData?: Record<string, any>;

    static async get(ids: number[]): Promise<Option[]> {
        ids = ids.filter(Boolean);
        if (!ids || !ids.length) return [];

        const optionData = await wpdb
            .selectFrom('wpOptions')
            .where('optionId', 'in', ids)
            .select(['optionId', 'optionName', 'optionValue'])
            .execute();

        const optionDataMap = new Map(optionData.map(option => [Number(option.optionId), option]));

        return ids.map(id => {
            const instance = new Option(id);

            instance.optionData = optionDataMap.get(id);

            return instance;
        })
    }

    get optionName(): string { return this.optionData?.['optionName'] ?? ''};
    get optionValue(): string { return this.optionData?.['optionValue'] ?? ''};
}
