import { acfFieldGroupAutoloader } from '@/lib/nextpress/acf/acfFieldGroupAutoloader';
import ACFBuilder from '@/lib/nextpress/acf/ACFBuilder'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers';
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

function isAuthorized(headerList: ReadonlyHeaders): boolean {
    const authHeader = headerList.get('Authorization');
    if (authHeader && authHeader.startsWith('api-key ')) {
        const apiKey = authHeader.split(' ')[1];
        return apiKey === process.env.CROSS_CONTAINER_API_KEY;
    } else {
        return false;
    }
}

export async function GET(_request: Request) {
    if (!isAuthorized(await headers())) {
        return NextResponse.json('Unauthorized access', { status: 403 })
    }

    try {
        const fieldGroups = await acfFieldGroupAutoloader();
        const acfBuilder = new ACFBuilder().registerFieldGroups(fieldGroups);

        return NextResponse.json(acfBuilder.getFieldGroups(), { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Error building ACF fields', error: String(error) },
            { status: 500 }
        );
    }
}
