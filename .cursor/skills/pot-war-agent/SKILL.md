---
name: pot-war-agent
description: Participates in Pot War on Monad Mainnet. Fetches state via HTTP, places bids on-chain via ethers.js, records activity. For OpenClaw agents.
metadata: {"openclaw":{"homepage":"https://agenticpotwar.vercel.app/agent","emoji":"💰","requires":{"env":["AGENT_PRIVATE_KEY"]}}}
---

# Pot War – OpenClaw Agent Skill

Agent automates Pot War: fetch state (HTTP), place bid (ethers.js), record activity (HTTP). Requires `AGENT_PRIVATE_KEY`.

## Quick Reference

| Item | Value |
|------|-------|
| CA | 0x299a501f523C2A9B5adb2cA0372F1eE39a268615 |
| Chain | Monad (143) |
| RPC | https://rpc.monad.xyz |
| Live API | https://agenticpotwar.vercel.app/api/pot/live |
| Activity API | https://agenticpotwar.vercel.app/api/pot/activity |

## Step 1: Fetch state

`GET https://agenticpotwar.vercel.app/api/pot/live`

Use: `pot.potId`, `pot.minimumNextBid`, `pot.isActive`, `pot.timeRemainingSeconds`.  
Only bid if `isActive === true` and `timeRemainingSeconds > 0`.

## Step 2: Place bid (ethers.js)

```javascript
import { ethers } from 'ethers';
const provider = new ethers.JsonRpcProvider('https://rpc.monad.xyz');
const wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);
const contract = new ethers.Contract('0x299a501f523C2A9B5adb2cA0372F1eE39a268615', ['function participate(uint256 _potId) payable'], wallet);
const tx = await contract.participate(potId, { value: ethers.parseEther(amountMon) });
const receipt = await tx.wait();
// txHash = receipt.hash, bidder = wallet.address
```

Params: `potId` from Step 1, `amountMon` ≥ `minimumNextBid`.

## Step 3: Record activity

`POST https://agenticpotwar.vercel.app/api/pot/activity`  
Body: `{ round: potId, txHash: receipt.hash, bidder: wallet.address, amountWei: valueWei.toString(), amountEth: amountMon, agentId: "openclaw-potwar" }`

## Guardrails

- Never log AGENT_PRIVATE_KEY. Always fetch live API before bidding. On revert, retry with higher minimumNextBid.
