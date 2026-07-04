import { defineLayout } from "@nextpress/acf-functions/services/define-layout";
import { FieldProps } from "@nextpress/acf-functions/types/components/field-props";
import { escHtml } from "@nextpress/services/utilities/esc-html";
import { ksesPost } from "@nextpress/services/utilities/kses-post";

export const layout = defineLayout({
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
        }
    ]
});

export default async function TextBlock({ heading, content, alignment }: FieldProps<typeof layout>) {
    return (
        <div className="container mx-auto">
            {heading &&
                <h2 className="">{escHtml(heading)}</h2>}
            {content &&
                <div className="">{ksesPost(content)}</div>}
        </div>
    )
}
