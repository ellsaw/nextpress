import type { Metadata } from "next";
import "@/app/_css/globals.css";
import wpGetLanguageAttributes from "@/lib/nextpress/wordpress/services/metadata/wpGetLanguageAttributes";
import wpGetBlogname from "@/lib/nextpress/wordpress/services/metadata/wpGetBlogname";
import wpGetFaviconURL from "@/lib/nextpress/wordpress/services/metadata/wpGetFaviconURL";
import WPOptionLoader from "@/lib/nextpress/wordpress/core/WPOptionLoader";

export async function generateMetadata(): Promise<Metadata> {
    const [blogname, iconURL] = await Promise.all([
        wpGetBlogname(),
        wpGetFaviconURL()
    ]);

    return {
        title: blogname,
        icons: {
            icon: iconURL
        }
    }
}

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    await WPOptionLoader.instance().preLoadOptions();

    const languageAttributes = await wpGetLanguageAttributes();

    return (
        <html
            lang={languageAttributes}
        >
            <body className="">
                <main className="container mx-auto">
                    {children}
                </main>
            </body>
        </html>
    );
}
