import { WPPost } from "@/lib/wordpress/types/entities/WPPost";
import wpValidatePath from "./helpers/wpValidatePath";
import WPPostQuery from "../../core/WPPostQuery";

/**
 * Resolves a single leaf WordPress post from a specific page or route URL path.
 * It queries all potential descendant posts starting from the root slug, validates that the database parent-child hierarchy strictly matches the array of path segments, and returns the final target post if the path is fully verified.
 *
 * @param {string[]} postPath - An array of URL path segments (slugs) representing the nested page route.
 * @returns {Promise<WPPost | undefined>} A promise that resolves to the target `WPPost` if the full path hierarchy is valid; otherwise, `undefined`.
 *
 * @example
 * // Resolves the "about-us" page object from the path ['company', 'about-us']
 * const pagePost = await wpResolvePostFromPath(['company', 'about-us']);
 */
export default async function wpResolvePostFromPath(postPath: string[]): Promise<WPPost | undefined> {
    const query = new WPPostQuery({
        postSlugAncestryOf: postPath[0],
        postStatus: 'publish',
        ignoreStickyPosts: true,
        nopaging: true,
        noFoundRows: true
    })
    const posts = await query.getPosts();
    const post = posts[postPath.length - 1];

    if (wpValidatePath(postPath, posts, {slugKey: 'postName', parentKey: 'postParent', idKey: 'ID'})) {
        return post;
    }
}
