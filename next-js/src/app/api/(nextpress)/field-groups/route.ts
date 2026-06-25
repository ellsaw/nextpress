import { apiGetFieldGroups as apiGetFieldGroups } from '@/lib/nextpress/router/routes/api/api-get-field-groups';

export async function GET(_request: Request) {
    return await apiGetFieldGroups();
}
