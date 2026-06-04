import acfGetLayoutValues from "./acf-get-layout-values";

type Props = {
    name: string,
}

export default async function RenderLayout({ name }: Props) {
    const components = await acfGetLayoutValues(name);
    if (!components) return;

    return components.map((component, index) => <component.Component key={`component_${name}_${index}`} {...component.props}/>)
}
