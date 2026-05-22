import { NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { AdminUser } from "@/types/admin";

export async function GET(): Promise<NextResponse> {
  const result = await backendFetch<AdminUser[]>("/api/v1/admin/users");
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
