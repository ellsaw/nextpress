import { defineLayout } from "@nextpress/acf-functions/services/define-layout";
import { FieldProps } from "@nextpress/acf-functions/types/components/field-props";
import { ksesPost } from "@nextpress/services/utilities/kses-post";

export const layout = defineLayout({
    name: 'the_content',
    label: 'The Content',
    display: 'block',
    sub_fields: []
})

export default async function TheContent({}: FieldProps<typeof layout>) {
    const content = (await getThePosts())[0]?.postContent;
    return (
        <div className="container mx-auto">
            {content &&
                <div className="wysiwyg-content">
                    {ksesPost(content)}
                </div>
            }
        </div>
    )
}
