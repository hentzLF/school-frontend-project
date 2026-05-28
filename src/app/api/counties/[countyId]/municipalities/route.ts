import { NextRequest, NextResponse } from "next/server";
import { backendFetch, isErrorResponse } from "@/lib/backend";

type Municipality = { id: string; name: string; ehakCode: string };
type RouteParams = { params: Promise<{ countyId: string }> };

export async function GET(
  _request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  const { countyId } = await params;
  const result = await backendFetch<Municipality[]>(
    `/api/v1/counties/${countyId}/municipalities`,
    { requireAuth: false },
  );

  if (isErrorResponse(result)) return result;
  return NextResponse.json(result.data, { status: 200 });
}
