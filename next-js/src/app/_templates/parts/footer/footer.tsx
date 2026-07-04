import { RenderTheLogo } from "@nextpress/ui/render-the-logo";
import FooterMenu from "./menu/footer-menu-";

export default async function Footer() {
    return(
        <footer className="bg-black text-white">
            <nav className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between gap-8 px-4 py-8 md:py-24">
                    <FooterMenu className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 text-center md:text-left"/>
                    <div className="flex grow justify-center">
                        <RenderTheLogo className="h-24"/>
                    </div>
                </div>
            </nav>
        </footer>
    )
}

