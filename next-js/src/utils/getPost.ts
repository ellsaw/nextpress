import { WPPost } from '../types/WPPost';
import WPDatabaseDriver from '../lib/wordpress/db/WPDatabaseDriver';

export default async function getPost(slug: string): Promise<WPPost|null> {
    try {
        const db = WPDatabaseDriver.instance()
        const connection = db.connection; 
        if (!connection) throw new Error(db.errorMessage);

        const [rows] = await connection.query('SELECT * FROM `wp_posts` where `post_name` = ?', [slug]);

        const posts = rows as unknown as WPPost[];

        return posts[0];
    } catch (error: any) {
        console.error('getPost:', error.message)
        return null
    } 
}