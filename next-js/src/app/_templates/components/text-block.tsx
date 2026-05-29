import defineLayout from "@/lib/nextpress/acf/services/define-layout";
import { NextpressComponentProps } from "@/lib/nextpress/types/acf/components/ComponentProps";
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
        },
        {
            name: 'test_post',
            label: 'Test Post',
            type: 'link',
            return_format: 'url'
        }
    ]
});

export default async function TextBlock({ post, heading, content, alignment }: NextpressComponentProps<typeof layout>) {
    return (
        <div className="container mx-auto">
            {heading &&
                <h2>{wpEscHtml(heading)}</h2>}
            {content &&
                <div>{wpKsesPost(content)}</div>}
        </div>
    )
}
