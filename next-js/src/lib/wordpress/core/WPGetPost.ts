import WPDatabaseDriver from "../db/WPDatabaseDriver";

export default async function WPGetPost(searchProperty: string|number, searchValue: any): Promise<WPPost|undefined> {
    try {
        const db = WPDatabaseDriver.instance();
        const connection = db.connection; 
        if (!connection) throw new Error(db.errorMessage);

        const [rows]: any[] = await connection.query(`SELECT * FROM wp_posts WHERE ?? = ?`, [searchProperty, searchValue]);

        return rows[0] as WPPost ?? undefined;
    } catch (error: any) {
        console.error('WPGetPost:', error.message);
        return undefined;
    } 
}