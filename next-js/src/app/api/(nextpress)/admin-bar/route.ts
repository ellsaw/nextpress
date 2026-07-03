import { NextRequest } from 'next/server';
import { apiGetAdminBar } from 'nextpress/router/routes/api/api-get-admin-bar';

export async function GET(request: NextRequest) {
    return await apiGetAdminBar(request);
}
