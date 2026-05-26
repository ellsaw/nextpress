import { type Selectable } from 'kysely';
import { WpPost } from '../wpdb/wpdb';
import { WPAttachment } from './WPAttachment';

interface WPPost extends Selectable<WpPost> {
    path?: string | null;
    thumbnail?: WPAttachment | null;
};
