import getMenu from "@/lib/nextpress/services/get-menu";
import Link from "next/link";
import FooterMenuSubItem from "./footer-menu-sub-item";

type Props = {
    className?: string
}

export default async function FooterMenu({ className }: Props) {
    const menu = await getMenu('footer');
    if (!menu) return;

    return(
        <ul className={className}>
            {menu.map(item => (
                <li key={item.menuItem.ID} className="flex flex-col">
                    <Link href={item.menuItem.menuItemAttributes?.url ?? ''} className="text-lg font-bold hover:underline">
                        {item.menuItem.menuItemAttributes?.label}
                    </Link>
                    <ul className="flex flex-col gap-2">
                        {item.children.map(subitem => (
                            <FooterMenuSubItem key={subitem.menuItem.ID} item={subitem.menuItem} className="hover:underline"/>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    )
}
