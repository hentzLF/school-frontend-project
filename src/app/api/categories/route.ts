import { NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Category } from "@/types/category";

export async function GET(): Promise<NextResponse> {
  const result = await backendFetch<Category[]>("/api/v1/admin/categories", {
    requireAuth: false,
  });

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
