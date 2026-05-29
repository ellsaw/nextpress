import { WPUser } from "../../types/core/entities/WPUser";
import WPUserQuery from "../core/WPUserQuery";

export default async function wpGetUsers(id: number | number[]): Promise<WPUser[]> {
    const query = new WPUserQuery({
        userId: id,
        nopaging: true,
        noFoundRows: true,
    });

    return await query.getUsers();
}


