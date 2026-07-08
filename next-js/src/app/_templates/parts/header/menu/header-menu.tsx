import Link from "next/link";
import { getMenu } from "@nextpress/services/get-menu";

type Props = {
    className?: string
}

export default async function HeaderMenu({ className }: Props) {
    const menu = await getMenu('primary');
    if (!menu) return;

    return (
        <ul className={className}>
            {menu.map(menuItem => (
                <li key={menuItem.item.ID}>
                    <Link href={menuItem.item.menuItemAttributes?.url ?? ''} className="hover:underline">
                        {menuItem.item.menuItemAttributes?.label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
