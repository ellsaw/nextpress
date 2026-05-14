import WPDatabaseDriver from "../db/WPDatabaseDriver";

export default async function WPGetOption(option: string): Promise<unknown|undefined> {
    try {
        const db = WPDatabaseDriver.instance();
        const connection = db.connection; 
        if (!connection) throw new Error(db.errorMessage);

        const [rows]: any[] = await connection.query(`SELECT option_value FROM wp_options WHERE option_name = ?;`, [option]);

        return rows[0]?.option_value ?? undefined;
    } catch (error: any) {
        console.error('WPGetOption:', error.message);
        return undefined;
    } 
}