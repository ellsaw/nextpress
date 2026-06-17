export interface IPath {
    path: string
}

type Fields = {
    key: string,
    value: string
}[];

export interface IFieldLocation {
    getFields: (name: string) => Promise<Fields>
}
