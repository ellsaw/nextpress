import { type Selectable } from 'kysely';
import { WpPost } from '../wpdb/wpdb';

interface WPPost extends Selectable<WpPost> {
    path?: string | null;
};
