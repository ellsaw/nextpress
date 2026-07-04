import { RenderTheLogo } from "@nextpress/ui/render-the-logo";
import HeaderMenu from "./menu/header-menu";
import Link from "next/link";

export default async function Header() {
    return(
        <header className="pt-4 pb-2 border-b border-gray-200">
            <div className="container mx-auto">
                <Link href={'/'}>
                    <RenderTheLogo className="h-12 w-full text-center"/>
                </Link>
                <nav className="px-4">
                    <HeaderMenu className="container mx-auto flex flex-wrap justify-between gap-4 py-2"/>
                </nav>
            </div>
        </header>
    )
}
