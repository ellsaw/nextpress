import Header from "./parts/header/header";
import Footer from "./parts/footer/footer";

export async function LayoutTemplate({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <>
        <Header/>
        <main className="container mx-auto min-h-svh py-8">
            {children}
        </main>
        <Footer/>
        </>
    );
}

