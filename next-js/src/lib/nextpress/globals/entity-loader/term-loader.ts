import { ITerm } from "../../entities/term/term";
import Term from "../../entities/term/term-impl";
import TermQuery from "../../repository/termquery/term-query";
import { EntityLoader } from "./entity-loader";
import EntityLoaderBase from "./entity-loader-base";

class TermLoader extends EntityLoaderBase<ITerm, TermQueryArgs> {
    private static _instance: TermLoader;

    protected queryClass = TermQuery;

    private constructor() {
        super();
    }

    public static instance(): TermLoader {
        if (!this._instance) {
            this._instance = new TermLoader();
        }
        return this._instance;
    }

    protected async fetchFromDatabase(ids: number[]): Promise<ITerm[]> {
        return await Term.get(ids);
    }

    protected getEntityId(term: ITerm): number {
        return term.termId;
    }
}

declare global {
    var termLoader: EntityLoader<ITerm, TermQueryArgs>
    var getTerms: (ids: number[]) => Promise<ITerm[]>
    var getTerm: (id: number) => Promise<ITerm | undefined>
}

globalThis.termLoader = TermLoader.instance();
globalThis.getTerms = async (ids) => {
    return await termLoader.get(ids);
}
globalThis.getTerm = async (id) => {
    return (await termLoader.get([id]))[0];
}

export {};
