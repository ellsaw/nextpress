import { Selectable } from "kysely";
import { WpUser } from "../../types/wpdb/wpdb";

export interface IUser extends Selectable<WpUser> {
    roles: string[];
    showAdminBar: boolean;
}
