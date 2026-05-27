export const fieldGroup: ACFFieldGroup = {
    key: 'group_page_main_layouts',
    title: 'main_layouts',
    style: 'default',
    menu_order: 0,
    location: [[{param: 'post_type', operator: '==', value: 'page'}]],
    fields: [
        {
            key: '',
            name: 'components',
            label: 'Components',
            type: 'flexible_content',
            layouts: [

            ]
        }
    ]
}


