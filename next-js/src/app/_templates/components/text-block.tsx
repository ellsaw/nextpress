import defineLayout from "@/lib/nextpress/acf/services/define-layout";
import { FieldProps } from "@/lib/nextpress/types/acf/components/FieldProps";
import wpEscHtml from "@/lib/nextpress/wordpress/utilities/wpEscHtml";
import wpKsesPost from "@/lib/nextpress/wordpress/utilities/wpKsesPost";

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

export default async function TextBlock({ post, heading, content, alignment }: FieldProps<typeof layout>) {
    return (
        <div className="container mx-auto">
            {heading &&
                <h2 className="">{wpEscHtml(heading)}</h2>}
            {content &&
                <div className="text-pink-500">{wpKsesPost(content)}</div>}
        </div>
    )
}
