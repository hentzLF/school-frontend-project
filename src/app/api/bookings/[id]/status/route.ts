import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Booking } from "@/types/booking";

type RouteParams = { params: Promise<{ id: string }> };

const updateStatusSchema = z.object({
  status: z.enum(["Confirmed", "InProgress", "Completed", "Cancelled"]),
});

export async function PUT(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = updateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await backendFetch<Booking>(`/api/v1/bookings/${id}/status`, {
    method: "PUT",
    body: parsed.data,
  });

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
