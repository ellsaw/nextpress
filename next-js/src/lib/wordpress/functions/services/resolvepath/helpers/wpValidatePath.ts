interface PathValidationKeys<T> {
    slugKey: keyof T;
    parentKey: keyof T;
    idKey: keyof T;
}

/**
 * Validates whether a sequence of URL path slugs matches a hierarchical structure of items.
 * Verifies that the root item starts at the top level (parent === 0) and that each subsequent slug correctly references a child entity of the previous one.
 *
 * @template T - The type of the WordPress entity (e.g., WPPost or WPTerm).
 * @param {string[]} pathSlugs - An array of URL segments/slugs representing the path hierarchy to validate.
 * @param {T[]} items - The array of entities to check against.
 * @param {PathValidationKeys<T>} keys - The property name mappings for the entity.
 * @param {keyof T} keys.slugKey - The property name used for the path slug (e.g., 'slug' or 'postName').
 * @param {keyof T} keys.parentKey - The property name used for the parent ID (e.g., 'parent' or 'postParent').
 * @param {keyof T} keys.idKey - The property name used for the entity's unique ID (e.g., 'termId' or 'ID').
 * @returns {boolean} `true` if the path slugs form a valid, continuous parent-child hierarchy; otherwise, `false`.
 *
 * @example
 * const isValid = wpValidatePath(pathSlugs, posts, {
 * slugKey: "postName",
 * parentKey: "postParent",
 * idKey: "ID"
 * });
 */
export default function wpValidatePath<T>(
    pathSlugs: string[],
    items: T[],
    keys: PathValidationKeys<T>
): boolean {
    if (!items.length || pathSlugs.length > items.length || items[0][keys.parentKey] !== 0) {
        return false;
    }

    const itemMap: Map<string, T> = items.reduce((map, item) => {
        const slugValue = String(item[keys.slugKey]);
        map.set(slugValue, item);
        return map;
    }, new Map());

    for (let index = 0; index < pathSlugs.length; index++) {
        const pathSlug = pathSlugs[index];
        const item = itemMap.get(pathSlug);
        const next = itemMap.get(pathSlugs[index + 1]);

        if (index !== pathSlugs.length - 1) {
            const nextParent = next ? next[keys.parentKey] : undefined;
            const currentId = item ? item[keys.idKey] : undefined;

            if (nextParent !== currentId) {
                return false;
            }
        }
    }

    return true;
}
