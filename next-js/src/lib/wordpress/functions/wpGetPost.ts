import { Selectable } from 'kysely';
import wpdb from '../wpdb/wpdb';
import { WpPost } from '../types/wpdb/wpdb';

export default async function wpGetPost(id?: number, slug?: string): Promise<Selectable<WpPost> | undefined> {
    try {
        if (!id && !slug) throw new Error('Pass id or slug into wpGetPost');

        let query = wpdb.selectFrom('wpPosts').selectAll();

        if (id) {
            query = query.where('ID', '=', id);
        } else if (slug) {
            query = query.where('postName', '=', slug);
        }

        return await query.executeTakeFirst();
    } catch (error: any) {
        console.error('wpGetPost: ', error.message);
        return undefined;
    }
}