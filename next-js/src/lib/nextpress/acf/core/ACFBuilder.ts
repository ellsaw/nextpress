export default class ACFBuilder
{
    private fieldGroups: ACFFieldGroup[] = [];

    public constructor() {};

    public getFieldGroups(): ACFFieldGroup[] {
        return this.fieldGroups;
    }

    public toJSON(): string {
        return JSON.stringify(this.fieldGroups);
    }

    public registerFieldGroups(fieldGroups: NextpressFieldGroup[]): this {
        const keyedFieldGroups: ACFFieldGroup[] = fieldGroups.map(fieldGroup => ({
            ...fieldGroup,
            key: `group_${this.formatKeySuffix(fieldGroup.title)}`,
            fields: this.setFieldKeys(fieldGroup.fields, fieldGroup.title),
        }));

        this.fieldGroups = [...this.fieldGroups, ...keyedFieldGroups];

        return this;
    }

    private setFieldKeys(fields: NextpressField[], parentName: string): ACFField[] {
        return fields.map(field => {
            const keySuffix = this.formatKeySuffix(`${parentName}_${field.name}`);

            const childFields = field.sub_fields
                ? this.setFieldKeys(field.sub_fields, keySuffix)
                : undefined;

            const childLayouts = field.layouts
                ? this.setLayoutKeys(field.layouts, keySuffix)
                : undefined;

            return {
                ...field,
                key: `field_${keySuffix}`,
                sub_fields: childFields,
                layouts: childLayouts
            }});
    }

    private setLayoutKeys(layouts: NextpressLayout[], parentName: string): ACFLayout[] {
        return layouts.map(layout => {
            const keySuffix = this.formatKeySuffix(`${parentName}_${layout.name}`);

            const childFields = layout.sub_fields
                ? this.setFieldKeys(layout.sub_fields, `${parentName}_${layout.name}`)
                : undefined;

            return {
                ...layout,
                key: `layout_${keySuffix}`,
                sub_fields: childFields || [],
        }})
    }

    private formatKeySuffix(suffix: string): string {
        return suffix.replace(/[\s-]+/g, '_').toLowerCase();
    }
}
