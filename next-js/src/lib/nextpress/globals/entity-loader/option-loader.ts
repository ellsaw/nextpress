import { IOption } from "../../entities/option/option";
import Option from "../../entities/option/option-impl";
import OptionQuery from "../../repository/optionquery/option-query";
import { OptionQueryArgs } from "../../repository/optionquery/option-query-args";
import { EntityLoader } from "./entity-loader";
import EntityLoaderBase from "./entity-loader-base";

class OptionLoader extends EntityLoaderBase<IOption, OptionQueryArgs> {
    private static _instance: OptionLoader;

    protected queryClass = OptionQuery;

    private constructor() {
        super();
    }

    public static instance(): OptionLoader {
        if (!this._instance) {
            this._instance = new OptionLoader();
        }
        return this._instance;
    }

    protected async fetchFromDatabase(ids: number[]): Promise<IOption[]> {
        return await Option.get(ids);
    }

    protected getEntityId(option: IOption): number {
        return option.optionId;
    }
}

declare global {
    var optionLoader: EntityLoader<IOption, OptionQueryArgs>
    var getOption: (name: string) => Promise<string | undefined>;
}

globalThis.optionLoader = OptionLoader.instance();
globalThis.getOption = async (name) => {
    const foundOptions = await optionLoader.findAndPrime({
        column: 'optionName',
        operand: '=',
        value: name
    })

    return (await optionLoader.get(foundOptions.ids))[0]?.optionValue;
}
