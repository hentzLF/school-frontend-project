import { NextResponse } from "next/server";
import { clearAuthCookiesOnResponse } from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true }, { status: 200 });
  clearAuthCookiesOnResponse(response);
  return response;
}
