import { Selectable } from 'kysely';
import wpdb from '../wpdb/wpdb';
import { WpPost } from '../types/wpdb/wpdb';

type Posts = Selectable<WpPost>;

export default async function wpGetPosts<K extends keyof Posts>(
    searchProperty: K, 
    searchValue: Posts[K]
): Promise<Posts[] | undefined> {
    const result = await wpdb
        .selectFrom('wpPosts')
        .selectAll()
        .where(searchProperty, 'in', searchValue as any) 
        .execute();

    return result;
}