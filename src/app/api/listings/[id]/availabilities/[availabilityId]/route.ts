import { NextRequest, NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";

type RouteParams = { params: Promise<{ id: string; availabilityId: string }> };

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { id, availabilityId } = await params;
  const result = await backendFetch<void>(
    `/api/v1/listings/${id}/availabilities/${availabilityId}`,
    { method: "DELETE" },
  );
  if (isErrorResponse(result)) return result;
  return new NextResponse(null, { status: 204 });
}
