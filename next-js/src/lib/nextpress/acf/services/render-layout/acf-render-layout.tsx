import { WPPost } from "../../../types/common/WPPost";
import acfGetLayoutValues from "./acf-get-layout-values";

type Props = {
    name: string,
    post: WPPost
}

export default async function ACFRenderLayout({ name, post }: Props) {
    const components = await acfGetLayoutValues(name, post.ID);

    return components.map((component, index) => <component.Component key={`component_${name}_${index}`} post={post} {...component.props}/>)
}
