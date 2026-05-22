import { NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { AdminDashboard } from "@/types/admin";

export async function GET(): Promise<NextResponse> {
  const result = await backendFetch<AdminDashboard>("/api/v1/admin/dashboard");
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
