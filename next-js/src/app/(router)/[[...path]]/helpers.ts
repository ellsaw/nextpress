export function getPageNumber(path: string[]): number|undefined {
    return path[path.length - 2] === 'page' ? Number(path[path.length - 1]) || undefined : undefined;
}

