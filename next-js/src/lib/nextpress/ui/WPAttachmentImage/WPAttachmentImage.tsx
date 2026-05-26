import wpGetAttachmentImage from "@/lib/nextpress/functions/services/wpGetAttachmentImage";
import { WPAttachment } from "@/lib/nextpress/types/entities/WPAttachment";
import { ClassValue } from "clsx";
import Image from "next/image";
import { ComponentPropsWithoutRef } from "react";

type BaseProps = Omit<ComponentPropsWithoutRef<typeof Image>, "src" | "alt" | "height" | "width"> & {
    className?: ClassValue;
};

type PropsWithId = BaseProps & {
    attachmentId: number;
    attachment?: never;
};

type PropsWithAttachment = BaseProps & {
    attachmentId?: never;
    attachment: WPAttachment;
};

type Props = PropsWithId | PropsWithAttachment;

export default async function AttachmentImage({ attachmentId, attachment, className, ...rest }: Props) {
    const imagePost = await wpGetAttachmentImage(attachmentId, attachment);
    if (!imagePost) return;

    return (
        <Image
            src={imagePost.src}
            alt={imagePost.alt ?? ''}
            height={imagePost.height}
            width={imagePost.width}
            className={className}
            {...rest}
        />
    );
}
