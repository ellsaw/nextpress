import { Selectable } from "kysely";
import { WpPost } from "../../types/wpdb/wpdb";
import { AsyncGetterInterface, IFieldLocation, IPath } from "../common";

type PostImageAttributes = {
    src?: string,
    alt?: string,
    height?: number,
    width?: number,
}

interface IBasePost extends Selectable<WpPost> {}

interface IPagePost extends IBasePost, IPath {}

interface IPostPost extends IBasePost, IPath {
    thumbnailId: number,
}

interface IAttachmentPost extends IBasePost {
    imageAttributes: PostImageAttributes,
}

interface IPost extends IBasePost, IPagePost, IPostPost, IAttachmentPost, IFieldLocation {};
