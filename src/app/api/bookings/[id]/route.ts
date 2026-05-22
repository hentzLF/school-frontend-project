import { NextRequest, NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Booking } from "@/types/booking";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { id } = await params;
  const result = await backendFetch<Booking>(`/api/v1/bookings/${id}`);
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
