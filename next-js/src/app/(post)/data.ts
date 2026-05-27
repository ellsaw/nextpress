import wpResolvePostFromPath from "@/lib/nextpress/functions/services/wordpress/resolvepath/wpResolvePostFromPath";
import { cache } from "react";

const getCachedPostByPathString = cache(async (pathString: string) => {
    return await wpResolvePostFromPath(pathString.split(","));
});

export async function getPost(postPathSlugs: string[]) {
    return getCachedPostByPathString(postPathSlugs.join(","));
}
