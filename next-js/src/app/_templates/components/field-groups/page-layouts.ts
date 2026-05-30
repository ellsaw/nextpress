import defineFieldGroup from '@/lib/nextpress/acf/services/define-field-group';
import { layout as TextBlock } from '../text-block';
import { layout as TheContent } from '../the-content';

export default defineFieldGroup({
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

