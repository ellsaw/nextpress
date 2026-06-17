import { unserialize } from "php-serialize";
import mapChoiceObject from "./helpers/map-choice-object";
import processURL from "../../../services/utilities/process-url";
import { ACFGoogleMapsObject, ACFIconObject, ACFLinkObject } from "@/lib/nextpress/acf/types/components/field-props";
import { acfComponentAutoloader } from "../../core/acf-component-autoloader";

const components = await acfComponentAutoloader();

function parsePhp(string?: string): unknown[] | { [key: string]: unknown } {
    return unserialize(string ?? 'a:0:{}') ?? [];
}

function getObjectIDs(value: string, multiple: boolean): number[] {
    if (multiple) {
        const postValueArray = parsePhp(value);
        if (!Array.isArray(postValueArray)) return [];

        return postValueArray.map(Number).filter(Boolean);
    } else {
        return [Number(value) ?? 0]
    }
}

export async function mapField(field: NextpressField, rawValues: ACFRawValues): Promise<any> {
    switch (field.type){
        case 'color_picker':
        case 'date_picker':
        case 'date_time_picker':
        case 'time_picker':
        case 'email':
        case 'password':
        case 'text':
        case 'textarea':
        case 'oembed':
        case 'wysiwyg':
        case 'file':
        case 'image':
            return rawValues.get(field.name);

        case 'number':
        case 'range':
            return Number(rawValues.get(field.name));

        case 'google_map':
            const mapValue = parsePhp(rawValues.get(field.name));
            if (Array.isArray(mapValue)) return;

            const mapObject: ACFGoogleMapsObject = mapValue as ACFGoogleMapsObject;
            return mapObject;

        case 'icon_picker':
            const iconValue = parsePhp(rawValues.get(field.name));
            if (Array.isArray(iconValue)) return;

            const iconObject: ACFIconObject = iconValue as ACFIconObject;
            if (field.return_format === 'string') {
                return iconObject.value;
            } else {
                return iconObject;
            }

        case 'button_group':
            return mapChoiceObject(field.return_format ?? 'value', rawValues.get(field.name));

        case 'checkbox':
            const checkBoxValues = parsePhp(rawValues.get(field.name));
            if (!Array.isArray(checkBoxValues)) return;

            return checkBoxValues.map(value => mapChoiceObject(field.return_format ?? 'value', typeof value === 'string' ? value : undefined, field.choices));

        case 'radio':
            return mapChoiceObject(field.return_format ?? 'value', rawValues.get(field.name), field.choices);

        case 'select':
            if (field.multiple === 1) {
                const selectValues = parsePhp(rawValues.get(field.name));
                if (!Array.isArray(selectValues)) return;

                return selectValues.map(value => mapChoiceObject(field.return_format ?? 'value', typeof value === 'string' ? value : undefined, field.choices));
            } else {
                return mapChoiceObject(field.return_format ?? 'value', rawValues.get(field.name), field.choices);
            }

        case 'true_false':
            return !!rawValues.get(field.name);

        case 'gallery':
            const galleryValues = parsePhp(rawValues.get(field.name));
            if (!Array.isArray(galleryValues)) return;

            return galleryValues;

        case 'flexible_content':
            const layoutValues = parsePhp(rawValues.get(field.name));
            if (!Array.isArray(layoutValues)) return;

            const layouts = field.layouts;
            const fcRawEntries = Array.from(rawValues.entries());

            const promises = layoutValues.map(async (layoutValue, index) => {
                const layout = layouts?.find(layout => layout.name === layoutValue);

                const prefix = `${field.name}_${index}_`;
                const prefixLength = prefix.length;

                const component = components.find(comp => comp.layout.name === layout?.name);

                const subFieldEntries = fcRawEntries
                    .filter(([key]) => key.startsWith(prefix))
                    .map(([key, value]) => [key.slice(prefixLength), value] as [string, any]);

                const flexibleValues = new Map<string, any>(subFieldEntries);

                const resolvedValues = await mapLayout(layout as any, flexibleValues);

                return {
                    Component: component?.Component,
                    content: resolvedValues
                };
            });

            return Promise.all(promises);

        case 'group':
            const groupValues = new Map(
                [...rawValues.entries()]
                    .filter(([key]) => key.startsWith(field.name) && key !== field.name)
                    .map(([key, value]) => {
                        const newKey = key.replace(`${field.name}_`, '');
                        return [newKey, value];
                    })
            );
            return await mapLayout(field as any, groupValues);

        case 'repeater':
            const repeaterRepeats = Number(rawValues.get(field.name)) || 0;
            const repeaterResults = [];

            const rRawEntries = Array.from(rawValues.entries());

            for (let index = 0; index < repeaterRepeats; index++) {
                const prefix = `${field.name}_${index}_`;
                const prefixLength = prefix.length;

                const subFieldEntries = rRawEntries
                    .filter(([key]) => key.startsWith(prefix))
                    .map(([key, value]) => [key.slice(prefixLength), value] as [string, any]);

                const repeatValues = new Map<string, any>(subFieldEntries);

                repeaterResults.push(mapLayout(field as any, repeatValues));
            }

            return Promise.all(repeaterResults);

        case 'link':
            const linkValue = parsePhp(rawValues.get(field.name));
            if (Array.isArray(linkValue)) return;

            const linkObject: ACFLinkObject = {
                title: typeof linkValue.title === 'string' ? linkValue.title : '',
                url: typeof linkValue.url === 'string' ? processURL(linkValue.url) : '',
                target: typeof linkValue.target === 'string' ? linkValue.target : '',
            }

            if (field.return_format === 'url') {
                return linkObject.url;
            } else {
                return linkObject
            }

        case 'page_link':
            if (field.multiple == 1) {
                const pageLinkValue = parsePhp(rawValues.get(field.name));
                if (!Array.isArray(pageLinkValue)) return;
                const pageLinkIds = pageLinkValue.map(Number).filter(Boolean);

                const posts = await getPosts(pageLinkIds);
                const postPaths = new Map(posts.map(post => [post.ID, post.path]));

                return pageLinkValue.map(page => postPaths.has(Number(page)) ? postPaths.get(Number(page)) : processURL(page as string));
            } else {
                const pageLinkValue = rawValues.get(field.name);
                const pageLinkId = Number(rawValues.get(field.name));
                if (!pageLinkValue) return;

                return pageLinkId ? (await getPost(pageLinkId))?.path : processURL(pageLinkValue);
            }

        case 'post_object':
            const postObjectIds: number[] = getObjectIDs(rawValues.get(field.name) ?? '', !!field.multiple)

            if (field.return_format === 'id') {
                return field.multiple ? postObjectIds : postObjectIds[0];
            } else {
                postLoader.prime(postObjectIds);
                const posts = await Promise.all(postObjectIds.map(id => getPost(id)));
                return field.multiple ? posts : posts[0];
            }

        case 'relationship':
            const relationshipArray = parsePhp(rawValues.get(field.name));
            if (!Array.isArray(relationshipArray)) return [];

            const relationshipIds = relationshipArray.map(Number).filter(Boolean);

            if (field.return_format === 'id') {
                return relationshipIds;
            } {
                postLoader.prime(relationshipIds);
                return await Promise.all(relationshipIds.map(id => getPost(id)));
            }

        case 'taxonomy':
            const termObjectIds = parsePhp(rawValues.get(field.name))
            if (!Array.isArray(termObjectIds)) return [];

            const termIds = termObjectIds.map(Number).filter(Boolean);

            if (field.return_format === 'id') {
                return field.multiple ? termIds : termIds[0];
            } else {
                const terms = await Promise.all(termIds.map(id => getTerm(id)));
                return field.multiple ? terms : terms[0];
            }

        case 'user':
            const userObjectIds: number[] = getObjectIDs(rawValues.get(field.name) ?? '', !!field.multiple)

            if (field.return_format === 'id') {
                return field.multiple ? userObjectIds : userObjectIds[0];
            } else {
                const users = await Promise.all(userObjectIds.map(id => getUser(id)));
                return field.multiple ? users : users[0];
            }
        }

    return undefined;
}

export async function mapLayout(layout: NextpressLayout, rawValues: ACFRawValues)  {
    const values: { [key: string]: any } = {};

    for (const subField of layout.sub_fields) {
        try {
            values[subField.name] = await mapField(subField, rawValues)
        } catch (error: any) {
            console.warn('Failed to map sub field: ', subField.name, error.message);
        }
    }

    return values;
}
