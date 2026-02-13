import { NextResponse } from "next/server";

/**
 * Stub for external callers (e.g. another app/tab) that poll /api/status.
 * This project does not use this route; returning 200 to stop 500 logs.
 */
export async function GET() {
  return NextResponse.json({ ok: true, status: "running" });
}
