import { NextRequest } from 'next/server';
import { apiGetDraftMode } from 'nextpress/router/routes/api/api-get-draft-mode';

export async function GET(request: NextRequest) {
    await apiGetDraftMode(request);
}
