import apiGetDraftMode from '@/lib/nextpress/router/routes/api/api-get-draft-mode';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    await apiGetDraftMode(request);
}
