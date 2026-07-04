import { defineFieldGroup } from '@nextpress/acf-functions/services/define-field-group';
import { layout as TextBlock } from '../text-block';
import { layout as TheContent } from '../the-content';

const pageLayouts = defineFieldGroup({
    title: 'Main Layouts',
    style: 'default',
    menu_order: 0,
    location: [[{param: 'post_type', operator: '==', value: 'page'}]],
    fields: [
        {
            name: 'components',
            label: 'Components',
            type: 'flexible_content',
            layouts: [
                TextBlock,
                TheContent,
            ],
            button_label: 'Add Component'
        }
    ]
});

export default pageLayouts;
