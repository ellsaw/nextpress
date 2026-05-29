import { WPPost } from "../../../types/common/WPPost";
import acfGetLayoutValues from "./acf-get-layout-values";

type Props = {
    name: string,
    post: WPPost
}
export default async function ACFRenderLayout({ name, post }: Props) {
    await acfGetLayoutValues(name, post.ID);

    return (
        <h1>Just tessin</h1>
    )
}
