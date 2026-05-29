import { layout as TextBlock } from './text-block';
import defineLayout from "@/lib/nextpress/acf/services/define-layout";
import { NextpressComponentProps } from "@/lib/nextpress/types/acf/components/ComponentProps";

export const layout = defineLayout({
    name: 'tester',
    label: 'Tester',
    display: 'block',
    sub_fields: [
        // ==========================================
        // Simple Scalar Return Types (string / number / boolean)
        // ==========================================
        {
            label: 'Color Picker',
            name: 'color_picker_field',
            type: 'color_picker'
        },
        {
            label: 'Date Picker',
            name: 'date_picker_field',
            type: 'date_picker'
        },
        {
            label: 'Date Time Picker',
            name: 'date_time_picker_field',
            type: 'date_time_picker'
        },
        {
            label: 'Google Map',
            name: 'google_map_field',
            type: 'google_map'
        },
        {
            label: 'Icon Picker',
            name: 'icon_picker_field',
            type: 'icon_picker'
        },
        {
            label: 'Time Picker',
            name: 'time_picker_field',
            type: 'time_picker'
        },
        {
            label: 'Email Field',
            name: 'email_field',
            type: 'email'
        },
        {
            label: 'Number Field',
            name: 'number_field',
            type: 'number'
        },
        {
            label: 'Password Field',
            name: 'password_field',
            type: 'password'
        },
        {
            label: 'Range Field',
            name: 'range_field',
            type: 'range'
        },
        {
            label: 'Text Field',
            name: 'text_field',
            type: 'text'
        },
        {
            label: 'Textarea Field',
            name: 'textarea_field',
            type: 'textarea'
        },
        {
            label: 'True / False Checkbox',
            name: 'true_false_field',
            type: 'true_false'
        },
        {
            label: 'oEmbed Field',
            name: 'oembed_field',
            type: 'oembed'
        },
        {
            label: 'WYSIWYG Editor',
            name: 'wysiwyg_field',
            type: 'wysiwyg'
        },

        // ==========================================
        // Button Group Variations
        // ==========================================
        {
            label: 'Button Group (Return Array Option)',
            name: 'button_group_arr',
            type: 'button_group',
            return_format: 'array',
            choices: { red: 'Red', blue: 'Blue' }
        },
        {
            label: 'Button Group (Return Label Option)',
            name: 'button_group_lbl',
            type: 'button_group',
            return_format: 'label',
            choices: { red: 'Red', blue: 'Blue' }
        },
        {
            label: 'Button Group (Return Value/String Option)',
            name: 'button_group_std',
            type: 'button_group',
            return_format: 'value',
            choices: { red: 'Red', blue: 'Blue' }
        },

        // ==========================================
        // Radio Variations
        // ==========================================
        {
            label: 'Radio (Return Array Option)',
            name: 'radio_arr',
            type: 'radio',
            return_format: 'array',
            choices: { yes: 'Yes', no: 'No' }
        },
        {
            label: 'Radio (Return Label Option)',
            name: 'radio_lbl',
            type: 'radio',
            return_format: 'label',
            choices: { yes: 'Yes', no: 'No' }
        },
        {
            label: 'Radio (Return Value/String Option)',
            name: 'radio_std',
            type: 'radio',
            return_format: 'value',
            choices: { yes: 'Yes', no: 'No' }
        },

        // ==========================================
        // Checkbox Variations
        // ==========================================
        {
            label: 'Checkbox (Return Object Arrays)',
            name: 'checkbox_arr',
            type: 'checkbox',
            return_format: 'array',
            choices: { apple: 'Apple', banana: 'Banana' }
        },
        {
            label: 'Checkbox (Return Label Arrays)',
            name: 'checkbox_lbl',
            type: 'checkbox',
            return_format: 'label',
            choices: { apple: 'Apple', banana: 'Banana' }
        },
        {
            label: 'Checkbox (Return Value/String Arrays)',
            name: 'checkbox_std',
            type: 'checkbox',
            return_format: 'value',
            choices: { apple: 'Apple', banana: 'Banana' }
        },

        // ==========================================
        // Select Variations (Multiple vs Single x Format)
        // ==========================================
        {
            label: 'Select (Multiple: Yes, Return Choice Object Array)',
            name: 'select_mult_arr',
            type: 'select',
            multiple: 1,
            return_format: 'array',
            choices: { opt1: 'Option 1', opt2: 'Option 2' }
        },
        {
            label: 'Select (Multiple: Yes, Return Label String Array)',
            name: 'select_mult_lbl',
            type: 'select',
            multiple: 1,
            return_format: 'label',
            choices: { opt1: 'Option 1', opt2: 'Option 2' }
        },
        {
            label: 'Select (Multiple: Yes, Return Value String Array)',
            name: 'select_mult_std',
            type: 'select',
            multiple: 1,
            return_format: 'value',
            choices: { opt1: 'Option 1', opt2: 'Option 2' }
        },
        {
            label: 'Select (Multiple: No, Return Choice Object)',
            name: 'select_sing_arr',
            type: 'select',
            multiple: 0,
            return_format: 'array',
            choices: { opt1: 'Option 1', opt2: 'Option 2' }
        },
        {
            label: 'Select (Multiple: No, Return Label String)',
            name: 'select_sing_lbl',
            type: 'select',
            multiple: 0,
            return_format: 'label',
            choices: { opt1: 'Option 1', opt2: 'Option 2' }
        },
        {
            label: 'Select (Multiple: No, Return Value String)',
            name: 'select_sing_std',
            type: 'select',
            multiple: 0,
            return_format: 'value',
            choices: { opt1: 'Option 1', opt2: 'Option 2' }
        },
        // ==========================================
        // Media Upload Variations (File, Image, Gallery)
        // ==========================================
        {
            label: 'File Upload (ID Return)',
            name: 'file_id',
            type: 'file',
            return_format: 'id'
        },
        {
            label: 'File Upload (URL Return)',
            name: 'file_url',
            type: 'file',
            return_format: 'url'
        },
        {
            label: 'Image Upload (ID Return)',
            name: 'image_id',
            type: 'image',
            return_format: 'id'
        },
        {
            label: 'Image Upload (URL Return)',
            name: 'image_url',
            type: 'image',
            return_format: 'url'
        },
        {
            label: 'Gallery Array (ID Returns)',
            name: 'gallery_id',
            type: 'gallery',
            return_format: 'id'
        },
        {
            label: 'Gallery Array (URL Returns)',
            name: 'gallery_url',
            type: 'gallery',
            return_format: 'url'
        },

        // ==========================================
        // Structural / Flexible Layout Link Helpers
        // ==========================================
        {
            label: 'Flexible Structural Layout',
            name: 'flexible_content_canvas',
            type: 'flexible_content',
            layouts: [
                TextBlock
            ]
        },
        {
            label: 'Link Picker (String URL Return)',
            name: 'link_url',
            type: 'link',
            return_format: 'url'
        },
        {
            label: 'Link Picker (Structured Link Object Return)',
            name: 'link_arr',
            type: 'link',
            return_format: 'array'
        },

        // ==========================================
        // Page Link Variations
        // ==========================================
        {
            label: 'Page Link Selection (Multiple: Yes)',
            name: 'page_link_mult',
            type: 'page_link',
            multiple: 1
        },
        {
            label: 'Page Link Selection (Multiple: No)',
            name: 'page_link_sing',
            type: 'page_link',
            multiple: 0
        },

        // ==========================================
        // WordPress Post Object Variations
        // ==========================================
        {
            label: 'Post Object (Multiple: Yes, Return Object Array)',
            name: 'post_object_mult_obj',
            type: 'post_object',
            multiple: 1,
            return_format: 'object'
        },
        {
            label: 'Post Object (Multiple: Yes, Return Numeric ID Array)',
            name: 'post_object_mult_id',
            type: 'post_object',
            multiple: 1,
            return_format: 'id'
        },
        {
            label: 'Post Object (Multiple: No, Return Single Object)',
            name: 'post_object_sing_obj',
            type: 'post_object',
            multiple: 0,
            return_format: 'object'
        },
        {
            label: 'Post Object (Multiple: No, Return Single Numeric ID)',
            name: 'post_object_sing_id',
            type: 'post_object',
            multiple: 0,
            return_format: 'id'
        },

        // ==========================================
        // Relationship Object Variations
        // ==========================================
        {
            label: 'Relationship Field (Return Single/Collection Objects)',
            name: 'relationship_obj',
            type: 'relationship',
            return_format: 'object'
        },
        {
            label: 'Relationship Field (Return Single/Collection IDs)',
            name: 'relationship_id',
            type: 'relationship',
            return_format: 'id'
        },

        // ==========================================
        // WordPress Taxonomy Variations
        // ==========================================
        {
            label: 'Taxonomy Term (Multiple: Yes, Return Object Array)',
            name: 'taxonomy_mult_obj',
            type: 'taxonomy',
            multiple: 1,
            return_format: 'object'
        },
        {
            label: 'Taxonomy Term (Multiple: Yes, Return Numeric ID Array)',
            name: 'taxonomy_mult_id',
            type: 'taxonomy',
            multiple: 1,
            return_format: 'id'
        },
        {
            label: 'Taxonomy Term (Multiple: No, Return Single Term Object)',
            name: 'taxonomy_sing_obj',
            type: 'taxonomy',
            multiple: 0,
            return_format: 'object'
        },
        {
            label: 'Taxonomy Term (Multiple: No, Return Single Numeric ID)',
            name: 'taxonomy_sing_id',
            type: 'taxonomy',
            multiple: 0,
            return_format: 'id'
        },

        // ==========================================
        // WordPress User Profiles Variations
        // ==========================================
        {
            label: 'User Selection (Multiple: Yes, Return Profile Object Array)',
            name: 'user_mult_obj',
            type: 'user',
            multiple: 1,
            return_format: 'object'
        },
        {
            label: 'User Selection (Multiple: Yes, Return Numeric ID Array)',
            name: 'user_mult_id',
            type: 'user',
            multiple: 1,
            return_format: 'id'
        },
        {
            label: 'User Selection (Multiple: No, Return Single Profile Object)',
            name: 'user_sing_obj',
            type: 'user',
            multiple: 0,
            return_format: 'object'
        },
        {
            label: 'User Selection (Multiple: No, Return Single Numeric ID)',
            name: 'user_sing_id',
            type: 'user',
            multiple: 0,
            return_format: 'id'
        },

        // ==========================================
        // Repeater and Group Fields
        // ==========================================
        {
            label: 'Repeater Loop Block',
            name: 'repeater_field_sample',
            type: 'repeater',
            layout: 'row',
            button_label: 'Add Row Element',
            sub_fields: [
                {
                    label: 'Repeater Inner Text',
                    name: 'inner_text_input',
                    type: 'text'
                },
                {
                    label: 'Repeater Inner Number',
                    name: 'inner_number_input',
                    type: 'number'
                }
            ]
        },
        {
            label: 'Object Group Container',
            name: 'group_field_sample',
            type: 'group',
            layout: 'block',
            sub_fields: [
                {
                    label: 'Group Inner Select',
                    name: 'inner_select_input',
                    type: 'select',
                    multiple: 0,
                    return_format: 'value',
                    choices: { active: 'Active', inactive: 'Inactive' }
                },
                {
                    label: 'Group Inner Boolean Switch',
                    name: 'inner_toggle_input',
                    type: 'true_false'
                }
            ]
        },
    ]
});

export default async function Tester(props: NextpressComponentProps<typeof layout>) {

}
