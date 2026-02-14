import { ObjectId } from "mongodb";

export interface PotActivityDoc {
  _id?: ObjectId;
  round: number;
  txHash: string;
  bidder: string;
  amountWei: string;
  amountEth: string;
  agentId?: string;
  agentDetails?: {
    name?: string;
    type?: string;
    metadata?: Record<string, unknown>;
  };
  timestamp: Date;
  blockNumber?: number;
}

export const POT_ACTIVITY_COLLECTION = "pot_activity";
