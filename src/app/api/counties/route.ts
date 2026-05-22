import { NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { County } from "@/types/county";

export async function GET(): Promise<NextResponse> {
  const result = await backendFetch<County[]>("/api/v1/counties", {
    requireAuth: false,
  });

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
