import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get('redirect') || '/';

    const draft = await draftMode();
    draft.enable();

    redirect(redirectUrl);
}
