import { type Selectable } from 'kysely';
import { WpUser } from '../wpdb/wpdb';

interface WPUser extends Selectable<WpUser> {
    roles: string[],
};
