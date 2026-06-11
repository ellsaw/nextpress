import { Selectable } from "kysely";
import { WpUser } from "../../types/wpdb/wpdb";
import { AsyncGetterInterface } from "../common";

export interface IUser extends Selectable<WpUser> {
    roles: string[];
    showAdminBar: boolean;
}
