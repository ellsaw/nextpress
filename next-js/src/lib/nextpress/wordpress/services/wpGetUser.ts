import { WPUser } from "../../types/core/entities/WPUser";
import WPUserQuery from "../core/WPUserQuery";

export default async function wpGetUser(id?: number, login?: string): Promise<WPUser | undefined> {
    const query = new WPUserQuery({
        userId: id,
        login: login,
        nopaging: true,
        noFoundRows: true,
    });

    const users = await query.getUsers();
    if (users.length === 0) return;

    return users[0];
}


