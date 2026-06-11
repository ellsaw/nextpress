import "@/lib/nextpress/globals/globals";
import "@/app/_css/globals.css";
import { LayoutTemplate } from "../_templates/layout";
import OptionLoader from "@/lib/nextpress/repository/option-loader/option-loader";
import getLanguageAttriubtes from "@/lib/nextpress/services/metadata/get-language-attribute";
import { cookies, draftMode } from "next/headers";
import RenderTheAdminBar from "@/lib/nextpress/ui/render-the-admin-bar";

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    const draftModeEnabled = (await draftMode()).isEnabled;
    let loggedInUserId = 0;
    if (draftModeEnabled) {
        const cookieStore = await cookies();
        loggedInUserId = Number(cookieStore.get('nextpress_logged_in_user_id')?.value) || 0;
    }

    await OptionLoader.instance().preLoadOptions();

    const languageAttributes = await getLanguageAttriubtes();

    return (
        <html
            lang={languageAttributes}
        >
            <body className="">
                {(draftModeEnabled && (await getUser(loggedInUserId))?.showAdminBar) && <RenderTheAdminBar loggedInUserId={loggedInUserId}/>}
                <LayoutTemplate>
                    {children}
                </LayoutTemplate>
            </body>
        </html>
    );
}
