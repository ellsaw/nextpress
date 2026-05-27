import { layout as TextBlock } from '../modules/textBlock';

const fieldGroup: NextpressFieldGroup = {
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
                TextBlock
            ],
            button_label: 'Add component'
        }
    ]
}

export default fieldGroup;

