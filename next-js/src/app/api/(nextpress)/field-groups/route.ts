import { apiGetFieldGroups } from "@nextpress/router/routes/api/api-get-field-groups";

export async function GET(_request: Request) {
    return await apiGetFieldGroups();
}
