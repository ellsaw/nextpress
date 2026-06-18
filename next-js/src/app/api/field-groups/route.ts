import { acfFieldGroupAutoloader } from '@/lib/nextpress/acf-functions/core/acf-field-group-autoloader';
import ACFBuilder from '@/lib/nextpress/acf-functions/core/acf-builder'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers';
import { isAuthorized } from '../helpers';

/**
 * Processes GET requests to retrieve built ACF field groups.
 *
 * @param {Request} _request - Incoming request.
 * @returns {Promise<NextResponse>} Response containing field groups or error.
 */
export async function GET(_request: Request) {
    if (!isAuthorized(await headers())) {
        return NextResponse.json('Unauthorized access', { status: 403 })
    }

    try {
        const fieldGroups = await acfFieldGroupAutoloader();
        const acfBuilder = new ACFBuilder().registerFieldGroups(fieldGroups);

        return NextResponse.json(acfBuilder.getFieldGroups(), { status: 200 });
    } catch (error: any) {
        console.error('Field Group API:', error.message)
        return NextResponse.json(
            { message: 'Error building ACF fields', error: String(error) },
            { status: 500 }
        );
    }
}
