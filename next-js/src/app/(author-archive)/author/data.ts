import wpResolvePostFromPath from "@/lib/wordpress/functions/services/resolvepath/wpResolvePostFromPath";
import wpGetUser from "@/lib/wordpress/functions/services/wpGetUser";
import { cache } from "react";

const getCachedUser = cache(async (userLogin: string) => {
    return await wpGetUser(undefined, userLogin);
});

export async function getUser(userLogin: string) {
    return await getCachedUser(userLogin);
}
