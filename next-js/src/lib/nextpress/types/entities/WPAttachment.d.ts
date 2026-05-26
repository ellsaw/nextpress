import { Selectable } from "kysely"
import { WPPost } from "./WPPost";

export interface WPAttachment extends Pick<WPPost, 'ID' | 'postTitle' | 'postExcerpt' | 'guid' | 'postMimeType'> {
    altText: string;
    metaData: string;
}
