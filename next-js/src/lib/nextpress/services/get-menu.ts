import { IMenuItem } from "../entities/post/post";

type Menu = {
    menuItem: IMenuItem,
    children: Menu[]
}

export default async function getMenu(menuSlug: string): Promise<Menu[] | undefined> {
    const menuTermQuery = await termLoader.findAndPrime({
        taxonomy: 'nav_menu',
        termSlug: menuSlug
    });

    const termId = menuTermQuery.ids[0];
    if (!termId) return;

    const postQuery = await postLoader.findAndPrime({
        termId,
        postType: 'nav_menu_item',
        noFoundRows: true,
        noPaging: true
    });

    const menuItems: IMenuItem[] = await getPosts(postQuery.ids);

    const objectIdsToFetch: number[] = [];
    for (const item of menuItems) {
        if (item.menuItemAttributes.type !== 'custom' && item.menuItemAttributes.objectId) {
            objectIdsToFetch.push(item.menuItemAttributes.objectId);
        }
    }

    if (objectIdsToFetch.length > 0) {
        postLoader.prime(objectIdsToFetch);
    }
    const postObjects = await getPosts(objectIdsToFetch);
    const postMap = new Map(postObjects.map(p => [p.ID, p]));

    const map = new Map<number, Menu>();

    // Fallback lookup map in case postParent references objectId instead of menu row ID
    const objectIdToMenuNodeMap = new Map<number, Menu>();

    const tree: Menu[] = [];

    for (const item of menuItems) {
        const menuItemAttributes = { ...item.menuItemAttributes };

        if (menuItemAttributes.type !== 'custom' && menuItemAttributes.objectId) {
            const object = postMap.get(menuItemAttributes.objectId);

            menuItemAttributes.url = object?.path;

            if (!menuItemAttributes.label) {
                menuItemAttributes.label = object?.postTitle || '';
            }
        }

        const safeItem: IMenuItem = {
            ...item,
            menuItemAttributes
        };

        const node: Menu = {
            menuItem: safeItem,
            children: []
        };

        map.set(Number(item.ID), node);

        if (item.menuItemAttributes.objectId) {
            objectIdToMenuNodeMap.set(Number(item.menuItemAttributes.objectId), node);
        }
    }

    for (const item of menuItems) {
        const currentNode = map.get(Number(item.ID))!;
        const parentId = Number(item.postParent);

        if (parentId === 0) {
            tree.push(currentNode);
        } else {
            // Attempt 1: Look up by WordPress standard (nav_menu_item row ID)
            // Attempt 2: Look up by destination objectId fallback
            const parentNode = map.get(parentId) || objectIdToMenuNodeMap.get(parentId);

            if (parentNode) {
                parentNode.children.push(currentNode);
            } else {
                // If it still can't find a parent, keep it on the root tree so it doesn't vanish
                tree.push(currentNode);
            }
        }
    }

    return tree;
}
