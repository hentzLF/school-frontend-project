import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Availability } from "@/types/availability";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { id } = await params;
  const result = await backendFetch<Availability[]>(
    `/api/v1/listings/${id}/availabilities`,
    { requireAuth: false },
  );
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}

const createAvailabilitySchema = z.object({
  startTime: z.string().min(1),
  endTime: z.string().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = createAvailabilitySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await backendFetch<Availability>(
    `/api/v1/listings/${id}/availabilities`,
    { method: "POST", body: parsed.data },
  );
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 201 });
}
