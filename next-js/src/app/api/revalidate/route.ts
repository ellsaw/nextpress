import { headers } from "next/headers";
import { isAuthorized } from "../helpers";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(_request: Request) {
    if (!isAuthorized(await headers())) {
        return NextResponse.json('Unauthorized access', { status: 403 })
    }
    try {
        revalidatePath('/', 'layout');

        return NextResponse.json({
            success: true,
            message: 'Saving and revalidation successful'
        }, { status: 200 });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            success: false,
            error: errorMessage
        }, { status: 500 });
    }
}
