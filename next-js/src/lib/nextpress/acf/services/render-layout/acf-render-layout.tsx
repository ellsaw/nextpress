import { IPost } from "@/lib/nextpress/entities/post/post";
import acfGetLayoutValues from "./acf-get-layout-values";

type Props = {
    name: string,
    post: IPost
}

export default async function ACFRenderLayout({ name, post }: Props) {
    const components = await acfGetLayoutValues(name);

    return components.map((component, index) => <component.Component key={`component_${name}_${index}`} post={post} {...component.props}/>)
}
