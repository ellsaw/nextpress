import { mapField } from "../../acf/services/map-fields/map-fields";
import { IFieldLocation } from "../../entities/common";
import { FieldProps } from "../../acf/types/components/field-props";

type Location = IFieldLocation | 'options';

declare global {
    var getField: <
        T extends NextpressFieldGroup,
        K extends keyof FieldProps<T> & string
    >(
        fieldGroup: T,
        selector: K,
        location?: Location
    ) => Promise<FieldProps<T>[K]>;
}

globalThis.getField = async (fieldGroup, selector, location) => {
    if (!location) {
        switch(queriedObject.objectType) {
            case 'post':
                location = await getThePost();
                break;
            // TODO: Add support for Term and User
            // case 'term':
            //     location = await getTheTerm();
            //     break;
            // case 'user':
            //     location = await getTheUser();
            //     break;
        }
    }
    if (!location) return [];

    const values = await (async () => {
        if (location === 'options') {
            const prefix = 'options_';

            const foundOptions = await optionLoader.findAndPrime({
                column: 'optionName',
                operand: 'like',
                value: `${prefix}%`
            })

            const options = await optionLoader.get(foundOptions.ids);

            return options.map(option => ({
                key: option.optionName.slice(prefix.length),
                value: option.optionValue
            }))
        }

        return await location.getFields(selector);
    })() ?? [];

    const valueMap: Map<string, string> = values.reduce((map, value) => {
        map.set(value.key, value.value);
        return map;
    }, new Map());

    const field = fieldGroup.fields.find(field => field.name === selector);
    if (!field) return;

    return mapField(field, valueMap) as any;
}
