import * as mysql from 'mysql2/promise';
import { WPPost } from '../types/WPPost';

export default async function getPost(slug: string): Promise<WPPost|null> {
    try {
        // Create the connection pool. The pool-specific settings are the defaults
        const pool = mysql.createPool({
            user: 'root',
            host: 'db',
            password: process.env.MYSQL_ROOT_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
        });
        
        const [rows, fields] = await pool.query('SELECT * FROM `wp_posts` where `post_name` = ?', [slug]);
        
        await pool.end();

        const posts = rows as unknown as WPPost[];

        return posts[0];
    } catch (error: any) {
        console.error('getPost:', error.message)
        return null
    } 
}