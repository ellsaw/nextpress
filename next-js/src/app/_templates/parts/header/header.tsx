import RenderTheLogo from "@/lib/nextpress/ui/render-the-logo";
import HeaderMenu from "./menu/header-menu";

export default async function Header() {
    return(
        <header className="pt-4 pb-2 border-b border-gray-200">
            <div>
                <RenderTheLogo className="h-12"/>
            </div>
            <nav className="px-4">
                <HeaderMenu className="container mx-auto flex flex-wrap justify-between gap-4 py-2"/>
            </nav>
        </header>
    )
}
