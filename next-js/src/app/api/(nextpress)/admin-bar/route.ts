import apiGetAdminBar from '@/lib/nextpress/router/routes/api/api-get-admin-bar';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    return await apiGetAdminBar(request);
}
