import DataLoader from "dataloader";
import wpdb from "../../wpdb/wpdb"
import { cache } from 'react';
import wpconfig from "../../wpconfig";
import { WPOption } from "../../types/core/entities/WPOptions";

export default class WPOptionLoader
{
    private dataLoader: DataLoader<string, WPOption | undefined, string>

    private preloaded = false;

    private constructor() {
        this.dataLoader = new DataLoader(this.batchOptions);
    };

    public static instance = cache(() => new WPOptionLoader());

    public async preLoadOptions(): Promise<void> {
        if (this.preloaded || !wpconfig.preLoadOptions || wpconfig.preLoadOptions?.length === 0) return;

        this.dataLoader.loadMany(wpconfig.preLoadOptions);

        this.preloaded = true;
    }

    public async getOption(optionName: string): Promise<WPOption | undefined> {
        return this.dataLoader.load(optionName);
    }

    private async batchOptions(optionNames: readonly string[]) {
        try {
            const query = wpdb.selectFrom('wpOptions')
                                .selectAll()
                                .where('optionName', 'in', optionNames);
            const options = await query.execute();

            const optionNameMap = new Map(
                options.map(option => [option.optionName, option])
            );
            return optionNames.map(optionName => optionNameMap.get(optionName) || undefined);
        } catch (error: any) {
            throw new Error(`WPOptionLoader: Error batching options: ${error.message}`, { cause: error });
        }
    }
}
