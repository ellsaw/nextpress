import wpGetOption from "./wpGetOption";

export default async function wpGetBlogname(): Promise<string> {
    const blognameOption = await wpGetOption('blogname');
    return blognameOption?.optionValue ?? 'My Blog';
}