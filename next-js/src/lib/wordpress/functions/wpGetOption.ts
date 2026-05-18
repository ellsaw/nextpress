import { Selectable } from "kysely";
import { WpOption } from "../types/wpdb/wpdb";
import wpdb from "../wpdb/wpdb";

export default async function wpGetOption(option: string): Promise<Selectable<WpOption>|undefined> {
    try {
        return await wpdb.selectFrom('wpOptions').where('optionName', '=', option).selectAll().executeTakeFirstOrThrow();
    } catch(error: any) {
        console.error('wpGetOption: ', error.message);
        return undefined;
    }
}