import { unserialize } from "php-serialize";
import { acfLayoutAutoloader } from "../../core/acf-layout-autoloader";
import acfMapSubFields from "./acf-map-sub-fields";
import WPPostMetaQuery from "@/lib/nextpress/wordpress/core/WPPostMetaQuery";
import { NextpressComponent } from "@/lib/nextpress/types/acf/components/NextpressComponent";

type ACFRawValues = Map<string, string>;

export default async function acfGetLayoutValues(name: string, postId: number) {
    const query = new WPPostMetaQuery([
        {
            postId,
            metaKey: {
                operand: 'like',
                variable: `${name}%`
            }
        }
    ]);

    const postMeta = await query.getPostMeta();

    try {
        const layouts = unserialize(postMeta.find(pm => pm.metaKey === name)?.metaValue ?? 'a:0:{}') ?? [];
        if (!Array.isArray(layouts)) throw new Error(`Layouts object has an unexpected type: ${typeof layouts}`);

        const components = await acfLayoutAutoloader();

        const promises = layouts.map(async (layout, index) => {
            if (typeof layout !== 'string') return null;

            const component = components.find(comp => comp.layout.name === layout);
            if (!component) return null;

            const rawValues: ACFRawValues = postMeta.reduce((map, pm) => {
                const prefix = `${name}_${index}_`;
                if (pm.metaKey?.startsWith(prefix)) {
                    const extractedKey = pm.metaKey.slice(prefix.length);

                    if (extractedKey && pm.metaValue) {
                        map.set(extractedKey, pm.metaValue);
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
