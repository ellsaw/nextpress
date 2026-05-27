import defineLayout from "@/lib/nextpress/acf/services/defineLayout";
import { ModuleProps } from "@/lib/nextpress/types/acf/ModuleProps";
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

export default async function TextBlock({ post, heading, content, alignment }: ModuleProps<typeof layout>) {
    return (
        <div className="container mx-auto">
            {heading &&
                <h2>{wpEscHtml(heading)}</h2>}
            {content &&
                <div>{wpKsesPost(content)}</div>}
        </div>
    )
}
