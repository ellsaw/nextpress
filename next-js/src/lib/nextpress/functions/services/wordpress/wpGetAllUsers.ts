import { WPUser } from "../../../types/core/entities/WPUser";
import WPUserQuery from "../../core/WPUserQuery";

export default async function wpGetAllUsers(): Promise<WPUser[]> {
    const query = new WPUserQuery({
        nopaging: true,
        noFoundRows: true,
        hasPublishedPosts: true
    });

    return await query.getUsers();
}

