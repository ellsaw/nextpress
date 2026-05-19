import wpGetOption from "./core/wpOptionQuery";

export default async function wpGetBlogname(): Promise<string> {
    const blognameOption = await wpGetOption('blogname');
    return blognameOption ?? 'My Blog';
}