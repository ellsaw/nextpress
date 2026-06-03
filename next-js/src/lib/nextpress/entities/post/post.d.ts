import { Selectable } from "kysely";
import { WpPost } from "../../types/wpdb/wpdb";
import { AsyncGetterInterface, IFieldLocation, IPath } from "../common";

type PostImageAttributes = {
    src?: string,
    alt?: string,
    height?: number,
    width?: number,
}

type MenuItemAttributes = {
    label: string,
    type?: 'custom' | 'post_type' | 'taxonomy',
    objectId?: number,
    url?: string,
}

interface IBasePost extends Selectable<WpPost> {}

interface IPagePost extends IBasePost, IPath {}

interface IPostPost extends IBasePost, IPath {
    thumbnailId: number,
}

interface IAttachmentPost extends IBasePost {
    imageAttributes: PostImageAttributes,
}

interface IMenuItem extends IBasePost {
    menuItemAttributes: MenuItemAttributes
}

interface IPost extends IBasePost, IPagePost, IPostPost, IAttachmentPost, IMenuItem, IFieldLocation {};
