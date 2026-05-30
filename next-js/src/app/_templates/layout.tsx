import Header from "./parts/header";
import Footer from "./parts/footer";

export async function LayoutTemplate({ children }: Readonly<{children: React.ReactNode;}>) {
    return (
        <>
        <Header/>
        <main className="container mx-auto">
            {children}
        </main>
        <Footer/>
        </>
    );
}

