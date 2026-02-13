import { createPublicClient, http } from "viem";
import { arbitrum } from "viem/chains";

/**
 * Standalone viem public client for Arbitrum One.
 * Used for contract reads – independent of the wallet adapter / Reown project ID.
 */
export const publicClient = createPublicClient({
  chain: arbitrum,
  transport: http("https://arb1.arbitrum.io/rpc"),
});
