import getOption from "../get-option";

export default async function getBlogname(): Promise<string> {
    const blognameOption = await getOption('blogname');
    return blognameOption ?? 'My Blog';
}
