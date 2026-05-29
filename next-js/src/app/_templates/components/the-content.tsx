import defineLayout from "@/lib/nextpress/acf/services/define-layout";
import { NextpressComponentProps } from "@/lib/nextpress/types/acf/components/ComponentProps";
import wpKsesPost from "@/lib/nextpress/wordpress/utilities/wpKsesPost";

export const layout = defineLayout({
    name: 'the_content',
    label: 'The Content',
    display: 'block',
    sub_fields: []
})

export default async function TheContent({ post }: NextpressComponentProps<typeof layout>) {
    return (
        <div className="container mx-auto">
            <div className="wysiwyg-content">
                {wpKsesPost(post.postContent)}
            </div>
        </div>
    )
}
