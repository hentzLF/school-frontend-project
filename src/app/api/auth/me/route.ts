import { NextResponse } from "next/server";
import { getToken } from "@/lib/auth";

export async function GET(): Promise<NextResponse> {
  const token = await getToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [, payloadB64] = token.split(".");
    const decoded = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8"),
    ) as Record<string, unknown>;

    const rawRole = decoded.role;
    const role = Array.isArray(rawRole) ? (rawRole as string[])[0] : rawRole;

    return NextResponse.json({
      id: decoded.sub ?? "",
      profileId: (decoded.profileId as string | undefined) ?? "",
      email: (decoded.email as string | undefined) ?? "",
      firstName: (decoded.given_name as string | undefined) ?? "",
      lastName: (decoded.family_name as string | undefined) ?? "",
      role: role ?? "Client",
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
