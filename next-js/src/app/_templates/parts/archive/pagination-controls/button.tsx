"use client";

import { usePathname } from "next/navigation";
import clsx, { ClassValue } from "clsx";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

type Props = {
    className?: ClassValue;
    text: string | number;
    destinationPage?: number;
};

export default function Button({ className, text, destinationPage }: Props) {
    const currentPath = usePathname();
    const basePath = currentPath.replace(/\/page\/\d+\/?$/, "").replace(/\/$/, "");
    const href = `${basePath}/page/${destinationPage}`;

    return (
        <>
            {destinationPage ? (
                <Link
                    href={href}
                    className={twMerge(clsx(className), 'hover:underline')}
                >
                    <span>{text}</span>
                </Link>
            ) : (
                <div className={twMerge(clsx(className), '')}>
                    <span>{text}</span>
                </div>
            )}
        </>
    );
}
