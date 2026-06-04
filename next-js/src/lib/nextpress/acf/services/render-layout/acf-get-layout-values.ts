import { unserialize } from "php-serialize";
import { acfLayoutAutoloader } from "../../core/acf-layout-autoloader";
import acfMapSubFields from "./acf-map-sub-fields";
import { NextpressComponent } from "@/lib/nextpress/types/acf/components/nextpress-component";

type ACFRawValues = Map<string, string>;

export default async function acfGetLayoutValues(name: string) {
    const post = await getThePost();
    if (!post) return;

    const fields = await post.getFields(name);

    try {
        const layouts = unserialize(fields.find(field => field.key === name)?.value ?? 'a:0:{}') ?? [];
        if (!Array.isArray(layouts)) throw new Error(`Layouts object has an unexpected type: ${typeof layouts}`);

        const components = await acfLayoutAutoloader();

        const promises = layouts.map(async (layout, index) => {
            if (typeof layout !== 'string') return null;

            const component = components.find(comp => comp.layout.name === layout);
            if (!component) return null;

            const rawValues: ACFRawValues = fields.reduce((map, field) => {
                const prefix = `${name}_${index}_`;
                if (field.key.startsWith(prefix)) {
                    const extractedKey = field.key.slice(prefix.length);

                    if (extractedKey && field.value) {
                        map.set(extractedKey, field.value);
                    }
                }
                return map;
            }, new Map());

            const subfields = await acfMapSubFields(component.layout, rawValues);

            return {
                Component: component.Component,
                props: subfields
            };
        });

        const resolvedResults = await Promise.all(promises);

        return resolvedResults.filter((item): item is (Pick<NextpressComponent, 'Component'> & { props: any }) => item !== null);

    } catch (error: any) {
        throw new Error('acfGetLayoutValues: ' + error.message);
    }
}
