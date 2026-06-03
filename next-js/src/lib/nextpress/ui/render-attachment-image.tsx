import { ClassValue } from "clsx";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";
import { IPost } from "../entities/post/post";
// import { getPost } from "../services/get-post";

type Props = Omit<ComponentPropsWithoutRef<typeof Image>, "src" | "alt" | "height" | "width"> & {
    /** Image ID or Post object */
    attachmentId: number;
    className?: ClassValue;
};

export default async function RenderAttachmentImage({ attachmentId, className, ...rest }: Props) {
    const image = await getPost(attachmentId);
    if (!image) return;

    const { src, alt, height, width } = image.imageAttributes;

    return (
        <Image
            src={src ?? ''}
            alt={alt ?? ''}
            height={height}
            width={width}
            className={className}
            {...rest}
        />
    );
}
