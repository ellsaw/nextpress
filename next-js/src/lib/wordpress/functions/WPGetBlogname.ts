import WPGetOption from "../core/WPGetOption";

export default async function WPGetBlogname(): Promise<string> {
    return await WPGetOption('blogname') as string|undefined ?? 'My Blog';
}