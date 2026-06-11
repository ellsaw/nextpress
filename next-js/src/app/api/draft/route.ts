import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const rawRedirectUrl = searchParams.get('redirect') || '/';
    const redirectUrl = `${rawRedirectUrl}?draftchecked=true`;

    const draft = await draftMode();

    const cookies = request.cookies.getAll();
    const wpCookie = cookies.find(cookie => cookie.name.startsWith('wordpress_logged_in_'));

    if (!wpCookie?.value) {
        console.warn('Wordpress login cookie missing.');
        draft.disable();
        redirect(redirectUrl);
    }

    try {
        console.log('Fetching internal URL:', process.env.WP_SERVICE_URL);

        const validLogin = await fetch(`${process.env.WP_SERVICE_URL}/wp-json/nextpress/v1/validate-user-session/?user_hash=${wpCookie.value}`, {
            headers: {
                'Authorization': `api-key ${process.env.CROSS_CONTAINER_API_KEY}`
            }
        });

        if (!validLogin.ok) throw new Error(`Validation failed with status code: ${validLogin.status}`);

        draft.enable();
    } catch (error: any) {
        console.warn('Could not validate Wordpress login:', error.message);
        draft.disable();
        redirect(redirectUrl);
    }

    redirect(redirectUrl);
}
