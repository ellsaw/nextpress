/**
 * Retrieves page number from path array.
 *
 * @param {string[]} path - Array of path segments.
 * @returns {number | undefined} Page number or undefined.
 */
export function getPageNumber(path: string[]): number|undefined {
    return path[path.length - 2] === 'page' ? Number(path[path.length - 1]) || undefined : undefined;
}

