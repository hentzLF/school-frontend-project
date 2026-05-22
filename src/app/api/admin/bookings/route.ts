import { NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Booking } from "@/types/booking";

export async function GET(): Promise<NextResponse> {
  const result = await backendFetch<Booking[]>("/api/v1/admin/bookings");
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
