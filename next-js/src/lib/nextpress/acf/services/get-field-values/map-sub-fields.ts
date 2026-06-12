import { unserialize } from "php-serialize";
import mapChoiceObject from "./helpers/map-choice-object";
import processURL from "../../../services/utilities/process-url";
import { ACFGoogleMapsObject, ACFIconObject, ACFLinkObject } from "@/lib/nextpress/types/acf/components/field-props";

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

async function mapSubField(subField: NextpressField, rawValues: ACFRawValues): Promise<any> {
    switch (subField.type){
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
            return rawValues.get(subField.name);

        case 'number':
        case 'range':
            return Number(rawValues.get(subField.name));

        case 'google_map':
            const mapValue = parsePhp(rawValues.get(subField.name));
            if (Array.isArray(mapValue)) return;

            const mapObject: ACFGoogleMapsObject = mapValue as ACFGoogleMapsObject;
            return mapObject;

        case 'icon_picker':
            const iconValue = parsePhp(rawValues.get(subField.name));
            if (Array.isArray(iconValue)) return;

            const iconObject: ACFIconObject = iconValue as ACFIconObject;
            if (subField.return_format === 'string') {
                return iconObject.value;
            } else {
                return iconObject;
            }

        case 'button_group':
            return mapChoiceObject(subField.return_format ?? 'value', rawValues.get(subField.name));

        case 'checkbox':
            const checkBoxValues = parsePhp(rawValues.get(subField.name));
            if (!Array.isArray(checkBoxValues)) return;

            return checkBoxValues.map(value => mapChoiceObject(subField.return_format ?? 'value', typeof value === 'string' ? value : undefined, subField.choices));

        case 'radio':
            return mapChoiceObject(subField.return_format ?? 'value', rawValues.get(subField.name), subField.choices);

        case 'select':
            if (subField.multiple === 1) {
                const selectValues = parsePhp(rawValues.get(subField.name));
                if (!Array.isArray(selectValues)) return;

                return selectValues.map(value => mapChoiceObject(subField.return_format ?? 'value', typeof value === 'string' ? value : undefined, subField.choices));
            } else {
                return mapChoiceObject(subField.return_format ?? 'value', rawValues.get(subField.name), subField.choices);
            }

        case 'true_false':
            return !!rawValues.get(subField.name);

        case 'gallery':
            const galleryValues = parsePhp(rawValues.get(subField.name));
            if (!Array.isArray(galleryValues)) return;

            return galleryValues;

        case 'flexible_content':
            const layoutValues = parsePhp(rawValues.get(subField.name));
            if (!Array.isArray(layoutValues)) return;

            const layouts = subField.layouts;
            const fcResults: any[] = [];

            const fcRawEntries = Array.from(rawValues.entries());

            layoutValues.forEach(async (layoutValue, index) => {
                const layout = layouts?.find(layout => layout.name === layoutValue);

                const prefix = `${subField.name}_${index}_`;
                const prefixLength = prefix.length;

                const subFieldEntries = fcRawEntries
                    .filter(([key]) => key.startsWith(prefix))
                    .map(([key, value]) => [key.slice(prefixLength), value] as [string, any]);

                const flexibleValues = new Map<string, any>(subFieldEntries);

                fcResults.push(await mapSubFields(layout as any, flexibleValues));
            })

            return fcResults;

        case 'group':
            const groupValues = new Map(
                [...rawValues.entries()]
                    .filter(([key]) => key.startsWith(subField.name) && key !== subField.name)
                    .map(([key, value]) => {
                        const newKey = key.replace(`${subField.name}_`, '');
                        return [newKey, value];
                    })
            );
            return await mapSubFields(subField as any, groupValues);

        case 'repeater':
            const repeaterRepeats = Number(rawValues.get(subField.name)) || 0;
            const repeaterResults = [];

            const rRawEntries = Array.from(rawValues.entries());

            for (let index = 0; index < repeaterRepeats; index++) {
                const prefix = `${subField.name}_${index}_`;
                const prefixLength = prefix.length;

                const subFieldEntries = rRawEntries
                    .filter(([key]) => key.startsWith(prefix))
                    .map(([key, value]) => [key.slice(prefixLength), value] as [string, any]);

                const repeatValues = new Map<string, any>(subFieldEntries);

                repeaterResults.push(await mapSubFields(subField as any, repeatValues));
            }

            return repeaterResults;

        case 'link':
            const linkValue = parsePhp(rawValues.get(subField.name));
            if (Array.isArray(linkValue)) return;

            const linkObject: ACFLinkObject = {
                title: typeof linkValue.title === 'string' ? linkValue.title : '',
                url: typeof linkValue.url === 'string' ? processURL(linkValue.url) : '',
                target: typeof linkValue.target === 'string' ? linkValue.target : '',
            }

            if (subField.return_format === 'url') {
                return linkObject.url;
            } else {
                return linkObject
            }

        case 'page_link':
            if (subField.multiple == 1) {
                const pageLinkValue = parsePhp(rawValues.get(subField.name));
                if (!Array.isArray(pageLinkValue)) return;
                const pageLinkIds = pageLinkValue.map(Number).filter(Boolean);

                const posts = await getPosts(pageLinkIds);
                const postPaths = new Map(posts.map(post => [post.ID, post.path]));

                return pageLinkValue.map(page => postPaths.has(Number(page)) ? postPaths.get(Number(page)) : processURL(page as string));
            } else {
                const pageLinkValue = rawValues.get(subField.name);
                const pageLinkId = Number(rawValues.get(subField.name));
                if (!pageLinkValue) return;

                return pageLinkId ? (await getPost(pageLinkId))?.path : processURL(pageLinkValue);
            }

        case 'post_object':
            const postObjectIds: number[] = getObjectIDs(rawValues.get(subField.name) ?? '', !!subField.multiple)

            if (subField.return_format === 'id') {
                return subField.multiple ? postObjectIds : postObjectIds[0];
            } else {
                postLoader.prime(postObjectIds);
                const posts = await Promise.all(postObjectIds.map(id => getPost(id)));
                return subField.multiple ? posts : posts[0];
            }

        case 'relationship':
            const relationshipArray = parsePhp(rawValues.get(subField.name));
            if (!Array.isArray(relationshipArray)) return [];

            const relationshipIds = relationshipArray.map(Number).filter(Boolean);

            if (subField.return_format === 'id') {
                return relationshipIds;
            } {
                postLoader.prime(relationshipIds);
                return await Promise.all(relationshipIds.map(id => getPost(id)));
            }

        case 'taxonomy':
            const termObjectIds = parsePhp(rawValues.get(subField.name))
            if (!Array.isArray(termObjectIds)) return [];

            const termIds = termObjectIds.map(Number).filter(Boolean);

            if (subField.return_format === 'id') {
                return subField.multiple ? termIds : termIds[0];
            } else {
                const terms = await Promise.all(termIds.map(id => getTerm(id)));
                return subField.multiple ? terms : terms[0];
            }

        case 'user':
            const userObjectIds: number[] = getObjectIDs(rawValues.get(subField.name) ?? '', !!subField.multiple)

            if (subField.return_format === 'id') {
                return subField.multiple ? userObjectIds : userObjectIds[0];
            } else {
                const users = await Promise.all(userObjectIds.map(id => getUser(id)));
                return subField.multiple ? users : users[0];
            }
        }

    return undefined;
}

export default async function mapSubFields(layout: NextpressLayout, rawValues: ACFRawValues)  {
    const values: { [key: string]: any } = {};

    for (const subField of layout.sub_fields) {
        try {
            values[subField.name] = await mapSubField(subField, rawValues)
        } catch (error: any) {
            console.warn('Failed to map sub field: ', subField.name, error.message);
        }
    }

    return values;
}
