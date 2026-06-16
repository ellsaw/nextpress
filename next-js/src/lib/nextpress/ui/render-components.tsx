import { ResolvedFlexibleContent } from "../acf/types/components/field-props";

type Props = {
    layouts: ResolvedFlexibleContent<any>,
}

export default async function RenderComponents({ layouts }: Props) {
    return layouts.map((layout, index) => <layout.Component key={index} {...layout.content}/>)
}
