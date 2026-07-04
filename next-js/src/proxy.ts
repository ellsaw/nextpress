import { NextRequest } from "next/server";
import { nextpressProxy } from "@nextpress/router/nextpress-proxy";

export default function proxy(request: NextRequest) {
    return nextpressProxy(request);
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|.*\\.png$).*)',
    ],
}
