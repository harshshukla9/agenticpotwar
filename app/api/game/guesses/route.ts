import { NextResponse } from "next/server";

/**
 * Stub for external callers (e.g. word game) that poll /api/game/guesses.
 * This project does not use this route; returning 200 to stop 500 logs.
 */
export async function GET() {
  return NextResponse.json({ guesses: [] });
}
