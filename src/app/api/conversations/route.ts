import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Conversation } from "@/types/conversation";

const createConversationSchema = z.object({
  participantId: z.string().min(1),
  message: z.string().min(1),
});

export async function GET(): Promise<NextResponse> {
  const result = await backendFetch<Conversation[]>("/api/v1/conversations");
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
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

  const parsed = createConversationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await backendFetch<Conversation>("/api/v1/conversations", {
    method: "POST",
    body: parsed.data,
  });

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 201 });
}
