import { EntityLoader, EntityQuery } from "./entity-loader";
import { queriedObjectState } from "../globals";

type QueryConstructor<TArgs> = new (args: TArgs) => EntityQuery<TArgs>;

export interface ILoaderStorage<TEntity> {
    loadQueue: Set<number>;
    entityCache: Map<number, TEntity>;
    promisedEntities: Map<number, Promise<TEntity[]>>;
}

export default abstract class EntityLoaderBase<TEntity, TArgs> implements EntityLoader<TEntity, TArgs>
{
    protected abstract queryClass: QueryConstructor<TArgs>;
    protected abstract fetchFromDatabase(ids: number[]): Promise<TEntity[]>;
    protected abstract getEntityId(entity: TEntity): number;

    private getLocalState(): ILoaderStorage<TEntity> {
        const state = queriedObjectState();
        const loaderKey = `__loader_${this.constructor.name}`;

        if (!state.loaderStates[loaderKey]) {
            state.loaderStates[loaderKey] = {
                loadQueue: new Set(),
                entityCache: new Map(),
                promisedEntities: new Map()
            };
        }
        return state.loaderStates[loaderKey];
    }

    public prime(ids: number[]): void {
        const state = this.getLocalState();
        for (const id of ids) {
            if (state.loadQueue.has(id) || state.entityCache.has(id) || state.promisedEntities.has(id)) {
                continue;
            }
            state.loadQueue.add(id);
        }
    }

    public async findAndPrime(args: TArgs): Promise<{ ids: number[]; count: number }> {
        const query = new this.queryClass(args);

        const ids = await query.getIds();
        const count = query.getCount() ?? ids.length;

        this.get(ids);

        return { ids, count };
    }

    public async get(ids: number[]): Promise<TEntity[]> {
        const state = this.getLocalState();

        const newIds = ids.filter(id => !state.entityCache.has(id) && !state.promisedEntities.has(id));

        if (newIds.length > 0) {
            this.prime(newIds);
        }

        if (state.loadQueue.size > 0) {
            const queue = Array.from(state.loadQueue);
            state.loadQueue.clear();

            const fetchPromise = this.fetchFromDatabase(queue).then(queuedEntities => {
                queuedEntities.forEach(entity => state.entityCache.set(this.getEntityId(entity), entity));
                queue.forEach(id => state.promisedEntities.delete(id));
                return queuedEntities;
            });

            queue.forEach(id => {
                state.promisedEntities.set(id, fetchPromise);
            });
        }

        const activePromises = Array.from(
            new Set(
                ids
                    .map(id => state.promisedEntities.get(id))
                    .filter((p): p is Promise<TEntity[]> => !!p)
            )
        );

        if (activePromises.length > 0) {
            await Promise.all(activePromises);
        }

        return ids.flatMap(id => {
            const entity = state.entityCache.get(id);
            return entity ? [entity] : [];
        });
    }
}
