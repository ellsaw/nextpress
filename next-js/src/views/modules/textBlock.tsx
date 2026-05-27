import { ACFLayoutFields } from "@/lib/nextpress/types/acf/ACFModuleProps";

export const layout = {
    key: '',
    name: 'text-block',
    label: 'Text Block',
    display: 'block',
    sub_fields: [
        {
            key: '',
            name: 'heading',
            label: 'Heading',
            type: 'text'
        },
        {
            key: '',
            name: 'content',
            label: 'Content',
            type: 'wysiwyg'
        },
        {
            key: '',
            name: 'alignment',
            label: 'Alignment',
            type: 'select',
            choices: {
                'left': 'Left',
                'center': 'Center',
                'right': 'Right'
            }
        },
        {
            key: '',
            name: 'link',
            label: 'Link',
            type: 'link',
            return_format: 'array'
        }
    ]
} as const satisfies ACFLayout;

function test(props: ACFLayoutFields<typeof layout>) {

}
