import logQuery from "../../wpdb/logQuery";
import wpdb from "../../wpdb/wpdb";

export default async function wpOptionQuery(optionName: string): Promise<string | undefined> {
    try {
        const query = wpdb.selectFrom('wpOptions').where('optionName', '=', optionName);
        logQuery(query);

        const option = await query.selectAll().executeTakeFirst();

        return option?.optionValue;
    } catch(error: any) {
        console.error('wpGetOption: Error while fetching option:', optionName, error.message);
        return undefined;
    }
}