import { NextpressNotFoundMetadata, NextpressNotFoundRoute } from "@/lib/nextpress/router/nextpress-not-found-route";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return await NextpressNotFoundMetadata();
}

export default async function NotFound() {
    return <NextpressNotFoundRoute/>;
}
