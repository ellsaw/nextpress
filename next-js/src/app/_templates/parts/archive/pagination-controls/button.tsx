"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

type Props = {
    className?: string;
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
                    className={`${className} hover:underline`}
                >
                    <span>{text}</span>
                </Link>
            ) : (
                <div className={className}>
                    <span>{text}</span>
                </div>
            )}
        </>
    );
}
