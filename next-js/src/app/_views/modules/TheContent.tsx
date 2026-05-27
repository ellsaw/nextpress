import defineLayout from "@/lib/nextpress/acf/services/defineLayout";
import { ModuleProps } from "@/lib/nextpress/types/acf/ModuleProps";
import wpKsesPost from "@/lib/nextpress/wordpress/utilities/wpKsesPost";

export const layout = defineLayout({
    name: 'the_content',
    label: 'The Content',
    display: 'block',
    sub_fields: []
})

export default async function TheContent({ post }: ModuleProps<typeof layout>) {
    return (
        <div className="container mx-auto">
            <div className="wysiwyg-content">
                {wpKsesPost(post.postContent)}
            </div>
        </div>
    )
}
