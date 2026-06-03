import getMenu from "@/lib/nextpress/services/get-menu";
import Link from "next/link";

export default async function FooterMenu() {
    const menu = await getMenu('footer');
    if (!menu) return;

    return(
        <ul>
        {menu.map(item => (
            <li key={item.menuItem.ID}>
                <Link href={item.menuItem.menuItemAttributes?.url ?? ''} className="text-lg">
                    {item.menuItem.menuItemAttributes?.label}
                </Link>
                <ul>
                    {item.children.map(subItem => (
                        <li key={subItem.menuItem.ID}>
                            <Link href={subItem.menuItem.menuItemAttributes?.url ?? ''} className="pl-2 text-md">
                                {subItem.menuItem.menuItemAttributes?.label}
                            </Link>
                            <ul>
                                {subItem.children.map(miniItem => (
                                    <li key={miniItem.menuItem.ID}>
                                        <Link href={miniItem.menuItem.menuItemAttributes?.url ?? ''} className="pl-4 text-sm">
                                            {miniItem.menuItem.menuItemAttributes?.label}
                                        </Link>
                                        <ul>
                                            {miniItem.children.map(miniestItem => (
                                                <li key={miniestItem.menuItem.ID}>
                                                    <Link href={miniestItem.menuItem.menuItemAttributes?.url ?? ''} className="pl-6 text-xs">
                                                        {miniestItem.menuItem.menuItemAttributes?.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </li>
        ))}
        </ul>
    )
}
