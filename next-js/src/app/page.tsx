import wpGetHomepage from "@/lib/nextpress/functions/services/wpGetHomepage";

export default async function Home() {
    const homePage = await wpGetHomepage();
    if (!homePage) return <p>Nextpress Error: Please enable static site homepage in wp-admin</p>;

    return (
        <>
        <h1>{ homePage.postTitle }</h1>
        </>
    )
}
