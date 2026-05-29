import { unserialize } from "php-serialize";
import mapChoiceObject from "./helpers/map-choice-object";
import mapAttachmentObject from "./helpers/map-attachment-object";
import processURL from "./helpers/process-url";
import wpGetPostPaths from "@/lib/nextpress/wordpress/services/wpGetPostPaths";
import wpGetPosts from "@/lib/nextpress/wordpress/services/wpGetPosts";
import wpGetTerms from "@/lib/nextpress/wordpress/services/wpGetTerms";
import wpGetUsers from "@/lib/nextpress/wordpress/services/wpGetUsers";

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
            return rawValues.get(subField.name);

        case 'date_picker':
            return rawValues.get(subField.name);

        case 'date_time_picker':
            return rawValues.get(subField.name);

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

        case 'time_picker':
            return rawValues.get(subField.name);

        case 'email':
            return rawValues.get(subField.name);

        case 'number':
            return Number(rawValues.get(subField.name));

        case 'password':
            return rawValues.get(subField.name);

        case 'range':
            return Number(rawValues.get(subField.name));

        case 'text':
            return rawValues.get(subField.name);

        case 'textarea':
            return rawValues.get(subField.name);

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

        case 'file':
            return (await mapAttachmentObject(subField.return_format ?? 'id', [Number(rawValues.get(subField.name))]))[0];

        case 'gallery':
            const galleryValues = parsePhp(rawValues.get(subField.name));
            if (!Array.isArray(galleryValues)) return;

            return await mapAttachmentObject(subField.return_format ?? 'id', galleryValues.map(Number).filter(Boolean));

        case 'image':
            return (await mapAttachmentObject(subField.return_format ?? 'id', [Number(rawValues.get(subField.name))]))[0];

        case 'oembed':
            return rawValues.get(subField.name);

        case 'wysiwyg':
            return rawValues.get(subField.name);

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

                fcResults.push(await acfMapSubFields(layout as any, flexibleValues));
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
            return await acfMapSubFields(subField as any, groupValues);

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

                repeaterResults.push(await acfMapSubFields(subField as any, repeatValues));
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

                const postPaths = await wpGetPostPaths(pageLinkValue.map(Number).filter(Boolean));

                return pageLinkValue.map(page => postPaths.has(Number(page)) ? postPaths.get(Number(page)) : processURL(page as string));
            } else {
                const pageLinkValue = rawValues.get(subField.name);
                const pageLinkId = Number(rawValues.get(subField.name));
                if (!pageLinkValue) return;

                return pageLinkId ? (await wpGetPostPaths([pageLinkId])).get(pageLinkId) : processURL(pageLinkValue);
            }

        case 'post_object':
            const postObjectIds: number[] = getObjectIDs(rawValues.get(subField.name) ?? '', !!subField.multiple)

            if (subField.return_format === 'id') {
                return subField.multiple ? postObjectIds : postObjectIds[0];
            } else {
                const posts = await wpGetPosts(postObjectIds);
                return subField.multiple ? posts : posts[0];
            }

        case 'relationship':
            const relationshipArray = parsePhp(rawValues.get(subField.name));
            if (!Array.isArray(relationshipArray)) return [];

            if (subField.return_format === 'id') {
                return relationshipArray;
            } {
                return await wpGetPosts(relationshipArray.map(Number).filter(Boolean));
            }

        case 'taxonomy':
            const termObjectIds = parsePhp(rawValues.get(subField.name))
            if (!Array.isArray(termObjectIds)) return [];

            if (subField.return_format === 'id') {
                return subField.multiple ? termObjectIds : termObjectIds[0];
            } else {
                const terms = await wpGetTerms(termObjectIds.map(Number).filter(Boolean));
                return subField.multiple ? terms : terms[0];
            }

        case 'user':
            const userObjectIds: number[] = getObjectIDs(rawValues.get(subField.name) ?? '', !!subField.multiple)

            if (subField.return_format === 'id') {
                return subField.multiple ? userObjectIds : userObjectIds[0];
            } else {
                const users = await wpGetUsers(userObjectIds);
                return subField.multiple ? users : users[0];
            }
        }

    return undefined;
}

export default async function acfMapSubFields(layout: NextpressLayout, rawValues: ACFRawValues)  {
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
