import clsx, { ClassValue } from "clsx";
import Link from "next/link"
import { twMerge } from "tailwind-merge";

type Props = {
    className?: ClassValue
    text: string|number,
    destinationPage?: number
}

export default function Button({className, text, destinationPage}: Props) {
    return(
        <>
        {destinationPage ? (
            <Link href={`?page=${destinationPage}`} className={twMerge(clsx(className), 'hover:underline')}>
                <span>{text}</span>
            </Link>
            ) : (
            <div className={twMerge(clsx(className), '')}>
                <span>{text}</span>
            </div>
        )}
        </>
    )
}
