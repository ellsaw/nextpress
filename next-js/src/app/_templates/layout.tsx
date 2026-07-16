import Header from "./parts/header/header";
import Footer from "./parts/footer/footer";
import { GlobalContextProvider } from "./parts/context/global-context-provider";

export async function LayoutTemplate({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <GlobalContextProvider>
        <div>
            <Header />
            <main className="min-h-svh">
                {children}
            </main>
            <Footer />
        </div>
        </GlobalContextProvider>
    );
}

