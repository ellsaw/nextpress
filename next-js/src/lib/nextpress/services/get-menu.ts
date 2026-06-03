import { IMenuItem } from "../entities/post/post";

type Menu = {
    menuItem: IMenuItem,
    children: Menu[]
}

export default async function getMenu(menuSlug: string): Promise<Menu[] | undefined> {
    const menuTermQuery = await termLoader.findAndPrime({
        taxonomy: 'nav_menu',
        termSlug: menuSlug
    })

    const termId = menuTermQuery.ids[0]
    if (!termId) return;

    const postQuery = await postLoader.findAndPrime({
        termId,
        postStatus: 'publish',
        postType: 'nav_menu_item',
        noFoundRows: true,
        noPaging: true
    })

    const menuItems: IMenuItem[] = (await getPosts(postQuery.ids)).sort((a, b) => a.menuOrder - b.menuOrder);

    // Prime cache to get paths i bunch later
    for (const item of menuItems) {
        if (!item.menuItemAttributes) continue;

        if (item.menuItemAttributes.type === 'post_type') {
            postLoader.prime([item.menuItemAttributes.objectId])
        } else if (item.menuItemAttributes.type === 'taxonomy') {
            termLoader.prime([item.menuItemAttributes.objectId])
        }
    }

    const map = new Map<number, Menu>();
    const tree: Menu[] = [];

    for (const item of menuItems) {
        if (!item.menuItemAttributes) continue;

        const menuItemAttributes = { ...item.menuItemAttributes };

        if (item.menuItemAttributes.type === 'post_type') {
            const post = await getPost(menuItemAttributes.objectId);

            menuItemAttributes.url = post?.path ?? '';

            if (!menuItemAttributes.label) {
                menuItemAttributes.label = post?.postTitle ?? '';
            }
        } else if (item.menuItemAttributes.type === 'taxonomy') {
            const term = await getTerm(menuItemAttributes.objectId);

            menuItemAttributes.url = term?.path ?? '';

            if (!menuItemAttributes.label) {
                menuItemAttributes.label = term?.name ?? '';
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

        map.set(item.ID, node);
    }

    for (const item of menuItems) {
        if (!item.menuItemAttributes) continue;

        const currentNode = map.get(item.ID);
        if (!currentNode) continue;

        const parentId = item.menuItemAttributes.parentId;

        if (parentId === 0) {
            tree.push(currentNode);
            continue;
        }

        const parentNode = map.get(parentId);

        if (parentNode) {
            parentNode.children.push(currentNode);
            map.set(parentNode.menuItem.ID, parentNode);
        }
    }

    return tree;
}
