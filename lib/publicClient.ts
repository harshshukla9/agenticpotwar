import { createPublicClient, http } from "viem";
import { monad } from "@/lib/chains";

/**
 * Standalone viem public client for Monad Mainnet.
 * Used for contract reads – independent of the wallet adapter / Reown project ID.
 */
export const publicClient = createPublicClient({
  chain: monad,
  transport: http("https://rpc.monad.xyz"),
});
