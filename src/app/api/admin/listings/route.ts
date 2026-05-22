import { NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Listing } from "@/types/listing";

export async function GET(): Promise<NextResponse> {
  const result = await backendFetch<Listing[]>("/api/v1/admin/listings");
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
