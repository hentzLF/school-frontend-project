import { NextRequest, NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Conversation } from "@/types/conversation";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  const { id } = await params;
  const result = await backendFetch<Conversation>(`/api/v1/conversations/${id}`);
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
