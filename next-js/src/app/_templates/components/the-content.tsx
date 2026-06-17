import defineLayout from "@/lib/nextpress/acf/services/define-layout";
import { FieldProps } from "@/lib/nextpress/acf/types/components/field-props";
import wpKsesPost from "@/lib/nextpress/services/utilities/kses-post";

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
                    {wpKsesPost(content)}
                </div>
            }
        </div>
    )
}
