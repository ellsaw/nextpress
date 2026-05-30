import "@/app/_css/globals.css";
import { LayoutTemplate } from "../_templates/layout";
import WPOptionLoader from "@/lib/nextpress/wordpress/core/WPOptionLoader";
import wpGetLanguageAttributes from "@/lib/nextpress/wordpress/services/metadata/wpGetLanguageAttributes";

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    await WPOptionLoader.instance().preLoadOptions();

    const languageAttributes = await wpGetLanguageAttributes();

    return (
        <html
            lang={languageAttributes}
        >
            <body className="">
                <LayoutTemplate>
                    {children}
                </LayoutTemplate>
            </body>
        </html>
    );
}
