import getFieldValues from "../acf/services/get-field-values/get-field-values";
import { IFieldLocation } from "../entities/common";

type Props = {
    name: string,
    location: IFieldLocation
}

export default async function RenderLayout({ name, location }: Props) {
    const fields = await location.getFields(name);
    const components = await getFieldValues(name, fields);
    if (!components) return;

    return components.map((component, index) => <component.Component key={`component_${name}_${index}`} {...component.props}/>)
}
