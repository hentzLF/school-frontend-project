import { NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";
import type { Payment } from "@/types/payment";

export async function GET(): Promise<NextResponse> {
  const result = await backendFetch<Payment[]>("/api/v1/admin/payments");
  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
