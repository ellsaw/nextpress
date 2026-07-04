import { NextpressLayout } from "@nextpress/router/nextpress-layout";

export default async function RootLayout({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <NextpressLayout>
            { children }
        </NextpressLayout>
    )
}
