import { ACFLayoutFields } from "@/lib/nextpress/types/acf/ACFModuleProps";

export const layout = {
    name: 'text_block',
    label: 'Text Block',
    display: 'block',
    sub_fields: [
        {
            name: 'heading',
            label: 'Heading',
            type: 'text',
        },
        {
            name: 'content',
            label: 'Content',
            type: 'wysiwyg'
        },
        {
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
            name: 'link',
            label: 'Link',
            type: 'link',
            return_format: 'array'
        }
    ]
} as const satisfies NextpressLayout;

function test(props: ACFLayoutFields<typeof layout>) {

}
