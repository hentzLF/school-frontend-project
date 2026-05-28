import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Equipment } from "@/types/equipment";

const createEquipmentSchema = z.object({
  name: z.string().min(1),
  make: z.string().min(1),
  model: z.string().optional(),
  manufactureYear: z.number().int().min(1900).max(2100).optional(),
  horsePower: z.number().int().min(0).max(10000).optional(),
  condition: z.string().min(1),
  description: z.string().optional(),
});

export async function GET(): Promise<NextResponse> {
  const result = await backendFetch<Equipment[]>("/api/v1/provider/equipment");
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

  const parsed = createEquipmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await backendFetch<Equipment>("/api/v1/provider/equipment", {
    method: "POST",
    body: parsed.data,
  });

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 201 });
}
