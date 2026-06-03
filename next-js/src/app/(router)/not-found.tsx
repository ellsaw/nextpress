import { NotFoundMetadata, NotFoundTemplate } from "@/lib/nextpress/template-heirarchy/not-found.tsx/not-found";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return await NotFoundMetadata();
}

export default async function NotFound() {
    return <NotFoundTemplate/>
}
