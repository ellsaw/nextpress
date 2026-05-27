import defineFieldGroup from '@/lib/nextpress/acf/services/defineFieldGroup';
import { layout as TextBlock } from '../modules/TextBlock';
import { layout as TheContent } from '../modules/TheContent';

export const pageLayouts = defineFieldGroup({
    title: 'Main Layouts',
    style: 'default',
    menu_order: 0,
    location: [[{param: 'post_type', operator: '==', value: 'page'}]],
    fields: [
        {
            name: 'modules',
            label: 'Modules',
            type: 'flexible_content',
            layouts: [
                TextBlock,
                TheContent
            ],
            button_label: 'Add Module'
        }
    ]
});

