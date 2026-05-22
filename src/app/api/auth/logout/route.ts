import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth";

export async function POST(): Promise<NextResponse> {
  await clearAuthCookies();
  return NextResponse.json({ success: true }, { status: 200 });
}
