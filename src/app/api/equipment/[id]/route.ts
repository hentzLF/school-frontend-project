import { NextRequest, NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Equipment } from "@/types/equipment";

type RouteParams = { params: Promise<{ id: string }> };

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

  const result = await backendFetch<Equipment>(
    `/api/v1/provider/equipment/${id}`,
    { method: "PUT", body },
  );

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { id } = await params;
  const result = await backendFetch<void>(
    `/api/v1/provider/equipment/${id}`,
    { method: "DELETE" },
  );

  if (isErrorResponse(result)) return result;
  return NextResponse.json({ success: true }, { status: 200 });
}
