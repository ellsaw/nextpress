import getMenu from "@/lib/nextpress/services/get-menu"
import Link from "next/link";

type Props = {
    className?: string
}

export default async function HeaderMenu({ className }: Props) {
    const menu = await getMenu('primary');
    if (!menu) return;

    return (
        <ul className={className}>
            {menu.map(item => (
                <li>
                    <Link href={item.menuItem.menuItemAttributes?.url ?? ''} className="hover:underline">
                        {item.menuItem.menuItemAttributes?.label}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
