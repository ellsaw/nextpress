import defineFieldGroup from '@/lib/nextpress/acf-functions/services/define-field-group';

const appOptions = defineFieldGroup({
    title: 'Options',
    style: 'default',
    menu_order: 0,
    location: [[{param: 'options_page', operator: '==', value: 'app_options'}]],
    fields: [
        {
            name: 'placeholder',
            label: 'Welcome to the Nextpress app options. Add fields in /app/_templates/components/field-groups/app-options.ts to get started',
            type: 'message',
        }
    ]
});

export default appOptions;
