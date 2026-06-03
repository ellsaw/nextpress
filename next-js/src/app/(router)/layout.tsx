import "@/lib/nextpress/globals/globals";
import "@/app/_css/globals.css";
import { LayoutTemplate } from "../_templates/layout";
import OptionLoader from "@/lib/nextpress/repository/option-loader/option-loader";
import getLanguageAttriubtes from "@/lib/nextpress/services/metadata/get-language-attribute";

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    await OptionLoader.instance().preLoadOptions();

    const languageAttributes = await getLanguageAttriubtes();

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
