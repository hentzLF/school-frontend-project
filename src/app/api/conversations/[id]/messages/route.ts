import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Message } from "@/types/conversation";

type RouteParams = { params: Promise<{ id: string }> };

type PaginatedResponse<T> = {
  items: T[] | null;
};

const sendMessageSchema = z.object({
  content: z.string().min(1),
});

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { id } = await params;
  const result = await backendFetch<Message[] | PaginatedResponse<Message>>(
    `/api/v1/conversations/${id}/messages`,
  );
  if (isErrorResponse(result)) return result;
  const items = Array.isArray(result.data)
    ? result.data
    : (result.data.items ?? []);
  return NextResponse.json(items, { status: 200 });
}

export async function POST(
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

  const parsed = sendMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await backendFetch<Message>(
    `/api/v1/conversations/${id}/messages`,
    {
      method: "POST",
      body: parsed.data,
    },
  );

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 201 });
}
