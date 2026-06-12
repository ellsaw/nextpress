export interface IPath {
    path: string
}

export type AsyncGetterInterface<T, PrimaryK extends keyof T> =
    Pick<T, PrimaryK>
    &
    {
        [K in keyof Omit<T, PrimaryK> as `get${Capitalize<string & K>}`]: () => Promise<T[K]>;
    };

export type Fields = {
    key: string,
    value: string
}[];

export interface IFieldLocation {
    getFields: (name: string) => Promise<Fields>
}
