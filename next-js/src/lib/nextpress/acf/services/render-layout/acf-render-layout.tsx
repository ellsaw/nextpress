import acfGetLayoutValues from "./acf-get-layout-values";

type Props = {
    name: string,
}

export default async function ACFRenderLayout({ name }: Props) {
    const components = await acfGetLayoutValues(name);

    return components.map((component, index) => <component.Component key={`component_${name}_${index}`} {...component.props}/>)
}
