import getMenu from "@/lib/nextpress/services/get-menu";
import Link from "next/link";

export default async function FooterMenu() {
    const menu = await getMenu('footer');
    if (!menu) return;

    for (const m of menu) {
        console.log(m.menuItem.menuItemAttributes);
        console.log(m.children)
    }
    return(
        <ul>
        {menu.map(item => (
            <li key={item.menuItem.ID}>
                <Link href={item.menuItem.menuItemAttributes.url ?? ''}>
                    {item.menuItem.menuItemAttributes.label}
                </Link>
                <ul>
                    {item.children.map(subItem => (
                        <li key={subItem.menuItem.ID}>
                            <Link href={subItem.menuItem.menuItemAttributes.url ?? ''} className="text-sm">
                                {subItem.menuItem.menuItemAttributes.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </li>
        ))}
        </ul>
    )
}
