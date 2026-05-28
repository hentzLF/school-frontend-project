import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Review } from "@/types/review";
import type { PaginatedResponse } from "@/types/api";

const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1),
});

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = request.nextUrl;
  const query = searchParams.toString();
  const path = `/api/v1/reviews${query ? `?${query}` : ""}`;

  const result = await backendFetch<PaginatedResponse<Review>>(path, {
    requireAuth: false,
  });
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

  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await backendFetch<Review>("/api/v1/reviews", {
    method: "POST",
    body: parsed.data,
  });

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 201 });
}
