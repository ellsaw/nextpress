import { ClassValue } from "clsx";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<typeof Image>, "src" | "alt" | "height" | "width"> & {
    attachmentImage: WPAttachmentImage;
    className?: ClassValue;
};

export default async function WPRenderAttachmentImage({ attachmentImage, className, ...rest }: Props) {
    return (
        <Image
            src={attachmentImage.src}
            alt={attachmentImage.alt ?? ''}
            height={attachmentImage.height}
            width={attachmentImage.width}
            className={className}
            {...rest}
        />
    );
}
