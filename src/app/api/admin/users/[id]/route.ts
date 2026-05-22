import { NextRequest, NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { AdminUser } from "@/types/admin";

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

  const result = await backendFetch<AdminUser>(`/api/v1/admin/users/${id}`, {
    method: "PUT",
    body,
  });

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { id } = await params;
  const result = await backendFetch<void>(`/api/v1/admin/users/${id}`, {
    method: "DELETE",
  });

  if (isErrorResponse(result)) return result;
  return NextResponse.json({ success: true }, { status: 200 });
}
