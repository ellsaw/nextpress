import "@/lib/nextpress/globals/globals";
import "@/app/_css/globals.css";
import { LayoutTemplate } from "../_templates/layout";
import getLanguageAttriubtes from "@/lib/nextpress/services/metadata/get-language-attribute";
import { cookies, draftMode } from "next/headers";
import RenderTheAdminBar from "@/lib/nextpress/ui/render-the-admin-bar";
import nextpressConfig from "../../../config.nextpress";

/**
 * The Root Layout for the application.
 * Defines the main HTML shell, handles Draft Mode validation, primes necessary global WordPress options,
 * and routes directly to the `LayoutTemplate` within the Nextpress template hierarchy.
 *
 * @param {Readonly<{children: React.ReactNode;}>} props - Component properties, wrapping the children pages.
 * @returns {Promise<JSX.Element>} The root layout of the entire app.
 */
export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    const draftModeEnabled = (await draftMode()).isEnabled;
    let loggedInUserId = 0;
    if (draftModeEnabled) {
        const cookieStore = await cookies();
        loggedInUserId = Number(cookieStore.get('nextpress_logged_in_user_id')?.value) || 0;
    }

    optionLoader.findAndPrime({
        column: 'optionName',
        operand: 'in',
        value: nextpressConfig.preLoadOptions || ''
    })

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
