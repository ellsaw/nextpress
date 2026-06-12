import { unserialize } from "php-serialize";
import { acfLayoutAutoloader } from "../../core/acf-layout-autoloader";
import mapSubFields from "./map-sub-fields";
import { NextpressComponent } from "@/lib/nextpress/types/acf/components/nextpress-component";

type Field = {
    key: string,
    value: string
}

export default async function getFieldValues(name: string, fields: Field[]) {
    try {
        const layouts = unserialize(fields.find(field => field.key === name)?.value || 'a:0:{}') || [];
        if (!Array.isArray(layouts)) throw new Error(`Layouts object has an unexpected type: ${typeof layouts}`);

        const components = await acfLayoutAutoloader();

        const promises = layouts.map(async (layout, index) => {
            if (typeof layout !== 'string') return null;

            const component = components.find(comp => comp.layout.name === layout);
            if (!component) return null;

            const rawValues: Map<string, string> = fields.reduce((map, field) => {
                const prefix = `${name}_${index}_`;
                if (field.key.startsWith(prefix)) {
                    const extractedKey = field.key.slice(prefix.length);

                    if (extractedKey && field.value) {
                        map.set(extractedKey, field.value);
                    }
                }
                return map;
            }, new Map());

            const subfields = await mapSubFields(component.layout, rawValues);

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
