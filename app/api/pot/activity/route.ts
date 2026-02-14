import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { POT_ACTIVITY_COLLECTION, type PotActivityDoc } from "@/lib/models/pot-activity";
import { z } from "zod";

const recordActivitySchema = z.object({
  round: z.number().int().positive(),
  txHash: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  bidder: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amountWei: z.string(),
  amountEth: z.string(),
  agentId: z.string().optional(),
  agentDetails: z
    .object({
      name: z.string().optional(),
      type: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    })
    .optional(),
  blockNumber: z.number().int().optional(),
});

/** POST: Record a bid activity (e.g. after agent places bid) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = recordActivitySchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection<PotActivityDoc>(POT_ACTIVITY_COLLECTION);

    const doc: PotActivityDoc = {
      round: parsed.data.round,
      txHash: parsed.data.txHash,
      bidder: parsed.data.bidder,
      amountWei: parsed.data.amountWei,
      amountEth: parsed.data.amountEth,
      agentId: parsed.data.agentId,
      agentDetails: parsed.data.agentDetails,
      timestamp: new Date(),
      blockNumber: parsed.data.blockNumber,
    };

    await col.insertOne(doc);

    return Response.json({ success: true, id: doc._id?.toString() });
  } catch (err) {
    console.error("[POST /api/pot/activity]", err);
    return Response.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}

/** GET: Fetch recent activity for a round (or all rounds) */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const round = searchParams.get("round");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50", 10), 100);

    const db = await getDb();
    const col = db.collection<PotActivityDoc>(POT_ACTIVITY_COLLECTION);

    const filter = round ? { round: parseInt(round, 10) } : {};
    const activities = await col
      .find(filter)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    const formatted = activities.map((a) => ({
      id: a._id?.toString(),
      round: a.round,
      txHash: a.txHash,
      bidder: a.bidder,
      amountWei: a.amountWei,
      amountEth: a.amountEth,
      agentId: a.agentId,
      agentDetails: a.agentDetails,
      timestamp: a.timestamp,
      blockNumber: a.blockNumber,
    }));

    return Response.json({ success: true, activities: formatted });
  } catch (err) {
    console.error("[GET /api/pot/activity]", err);
    return Response.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
