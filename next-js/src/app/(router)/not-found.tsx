import { Metadata } from "next";
import { NextpressNotFoundMetadata, NextpressNotFoundRoute } from "@nextpress/router/nextpress-not-found-route";

export async function generateMetadata(): Promise<Metadata> {
    return await NextpressNotFoundMetadata();
}

export default async function NotFound() {
    return <NextpressNotFoundRoute/>;
}
