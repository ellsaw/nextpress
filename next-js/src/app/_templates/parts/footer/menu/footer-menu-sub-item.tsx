import { IMenuItem } from "@/lib/nextpress/entities/post/post"
import Link from "next/link"

type Props = {
    item: IMenuItem,
    className?: string
}
export default async function FooterMenuSubItem({ item, className }: Props) {
    return(
        <li className={className}>
            {item.menuItemAttributes &&
                <Link href={item.menuItemAttributes.url}>{item.menuItemAttributes.label}</Link>
            }
        </li>
    )
}
