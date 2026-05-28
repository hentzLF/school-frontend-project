import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Booking } from "@/types/booking";
import type { PaginatedResponse } from "@/types/api";

const createBookingSchema = z.object({
  serviceListingId: z.string().uuid(),
  availabilityId: z.string().uuid(),
  areaInHectares: z.number().positive(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const query = searchParams.toString();
  const path = `/api/v1/bookings${query ? `?${query}` : ""}`;

  const result = await backendFetch<PaginatedResponse<Booking>>(path);
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data.items, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await backendFetch<Booking>("/api/v1/bookings", {
    method: "POST",
    body: parsed.data,
  });

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 201 });
}
