type NextpressComponentProps<LayoutT extends { sub_fields: readonly NextpressField[] } | NextpressField> =
    LayoutT extends { sub_fields: readonly NextpressField[] }
        ? {
            [Field in LayoutT['sub_fields'][number] as Field['name']]: MapFieldType<Field>
        } & { post: WPPost }
        : never;

type MapFieldType<Field> =
        Field extends { type: 'color_picker' }
            ? string | null
        : Field extends { type: 'date_picker' }
            ? string | null
        : Field extends { type: 'date_time_picker' }
            ? string | null
        : Field extends { type: 'google_map' }
            ? ACFGoogleMapsObject | null
        : Field extends { type: 'icon_picker' }
            ? Field extends { return_format: 'string' }
                ? string | null
            : Field extends { return_format: 'array' }
                ? ACFIconObject | null
            : ACFIconObject | null
        : Field extends { type: 'time_picker' }
            ? string | null
        : Field extends { type: 'email' }
            ? string | null
        : Field extends { type: 'number' }
            ? number | null
        : Field extends { type: 'password' }
            ? string | null
        : Field extends { type: 'range' }
            ? number | null
        : Field extends { type: 'text' }
            ? string | null
        : Field extends { type: 'textarea' }
            ? string | null
        : Field extends { type: 'button_group' }
            ? Field extends { return_format: 'array' }
                ? ACFChoiceObject | null
            : string | null
        : Field extends { type: 'checkbox' }
            ? Field extends { return_format: 'array' }
                ? ACFChoiceObject[]
            : string[]
        : Field extends { type: 'radio' }
            ? Field extends { return_format: 'array' }
                ? ACFChoiceObject | null
            : string | null
        : Field extends { type: 'select' }
            ? Field extends { multiple: 1 }
                ? Field extends { return_format: 'array' }
                    ? ACFChoiceObject[]
                : string[]
            : Field extends { return_format: 'array' }
                ? ACFChoiceObject | null
            : string | null
        : Field extends { type: 'true_false' }
            ? boolean
        : Field extends { type: 'file' }
            ? Field extends { return_format: 'id' }
                ? number | null
            : Field extends { return_format: 'url' }
                ? string | null
            : never
        : Field extends { type: 'gallery' }
            ? Field extends { return_format: 'id' }
                ? number[]
            : Field extends { return_format: 'url' }
                ? string[]
            : never
        : Field extends { type: 'image' }
            ? Field extends { return_format: 'id' }
                ? number | null
            : Field extends { return_format: 'url' }
                ? string | null
            : never
        : Field extends { type: 'oembed' }
            ? string | null
        : Field extends { type: 'wysiwyg' }
            ? string | null
        : Field extends { type: 'flexible_content' }
            ? ACFLayout[]
        : Field extends { type: 'link' }
            ? Field extends { return_format: 'url' }
                ? string | null
            : Field extends { return_format: 'array' }
                ? ACFLinkObject | null
            : ACFLinkObject
        : Field extends { type: 'page_link' }
            ? Field extends { multiple: 1 }
                ? string[]
            : string | null
        : Field extends { type: 'post_object' }
            ? Field extends { multiple: 1 }
                ? Field extends { return_format: 'object' }
                    ? WPPost[]
                : number[]
            : Field extends { return_format: 'object' }
                ? WPPost | null
            : number | null
        : Field extends { type: 'relationship' }
            ? Field extends { return_format: 'object' }
                ? WPPost[] | null
            : number[] | null
        : Field extends { type: 'taxonomy' }
            ? Field extends { multiple: 1 }
                ? Field extends { return_format: 'object' }
                    ? WPTerm[]
                : number[]
            : Field extends { return_format: 'object' }
                ? WPTerm | null
            : number | null
        : Field extends { type: 'user' }
            ? Field extends { multiple: 1 }
                ? Field extends { return_format: 'object' }
                    ? WPUser[]
                : number[]
            : Field extends { return_format: 'object' }
                ? WPUser | null
            : number | null
        : Field extends { sub_fields: readonly any[] }
            ? MapACFData<Field>
        : never;

type ACFIconObject = {
    type: string,
    value: string
}

type ACFLinkObject = {
    title: string,
    url: string,
    target: string
}

type ACFChoiceObject = {
    label?: string
    value?: string,
}

type ACFGoogleMapsObject = {
    address: string;
    lat: string | number;
    lng: string | number;
    zoom: string | number;
    place_id: string;
    name: string;
    street_number: string | number;
    street_name: string;
    street_name_short: string;
    city: string;
    state: string;
    state_short: string;
    post_code: string | number;
    country: string;
    country_short: string;
}
