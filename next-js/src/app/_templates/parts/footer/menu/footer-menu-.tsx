import Link from "next/link";
import FooterMenuSubItem from "./footer-menu-sub-item";
import { getMenu } from "@nextpress/services/get-menu";

type Props = {
    className?: string
}

export default async function FooterMenu({ className }: Props) {
    const menu = await getMenu('footer');
    if (!menu) return;

    return(
        <ul className={className}>
            {menu.map(menuItem => (
                <li key={menuItem.item.ID} className="flex flex-col">
                    <Link href={menuItem.item.menuItemAttributes?.url ?? ''} className="text-lg font-bold hover:underline">
                        {menuItem.item.menuItemAttributes?.label}
                    </Link>
                    <ul className="flex flex-col gap-2">
                        {menuItem.children.map(subitem => (
                            <FooterMenuSubItem key={subitem.item.ID} item={subitem.item} className="hover:underline"/>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    )
}
