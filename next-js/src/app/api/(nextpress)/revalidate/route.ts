import { apiPostRevalidate } from "@/lib/nextpress/router/routes/api/api-post-revalidate";

export async function POST(_request: Request) {
    return await apiPostRevalidate();
}
