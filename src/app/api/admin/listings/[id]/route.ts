import { NextRequest, NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { id } = await params;
  const result = await backendFetch<void>(`/api/v1/admin/listings/${id}`, {
    method: "DELETE",
  });

  if (isErrorResponse(result)) return result;
  return NextResponse.json({ success: true }, { status: 200 });
}
