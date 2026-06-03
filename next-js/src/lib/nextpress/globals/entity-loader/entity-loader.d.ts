export interface EntityLoader<EntityT, QueryArgsT> {
    prime: (ids: number[]) => void;
    findAndPrime: (args: QueryArgsT) => Promise<{ids: number[], count: number}>;
    get: (ids: number[]) => Promise<EntityT[]>;
}

export interface EntityQuery<TArgs> {
    getIds(): Promise<number[]>;
    getCount(): number | undefined;
}
