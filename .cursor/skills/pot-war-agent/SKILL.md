---
name: pot-war-agent
description: Participates in Pot War on Monad Mainnet. Fetches pot state via HTTP, places bids on-chain, records activity. For OpenClaw agents.
metadata: {"openclaw":{"homepage":"https://agenticpotwar.vercel.app/agent","emoji":"💰"}}
---

# Pot War – OpenClaw Agent Skill

**Purpose**: Interact with Pot War (Monad). Agent fetches state and records activity via HTTP; for bidding, provide params/code for the user.

## Quick Reference

| Item | Value |
|------|-------|
| App URL | https://agenticpotwar.vercel.app |
| CA | 0x299a501f523C2A9B5adb2cA0372F1eE39a268615 |
| Chain | Monad (143) |
| RPC | https://rpc.monad.xyz |
| Live API | https://agenticpotwar.vercel.app/api/pot/live |
| Activity API | https://agenticpotwar.vercel.app/api/pot/activity |

## Workflow

### Step 1: Fetch state (HTTP)

`GET https://agenticpotwar.vercel.app/api/pot/live`

Use: `pot.potId`, `pot.minimumNextBid`, `pot.isActive`, `pot.timeRemainingSeconds`.  
Only bid if `isActive === true` and `timeRemainingSeconds > 0`.

### Step 2: Place bid (needs wallet)

CA: `0x299a501f523C2A9B5adb2cA0372F1eE39a268615`  
Function: `participate(uint256 _potId) payable`  
Params: `_potId` = potId, `value` ≥ parseEther(minimumNextBid)

ABI: `[{"inputs":[{"internalType":"uint256","name":"_potId","type":"uint256"}],"name":"participate","outputs":[],"stateMutability":"payable","type":"function"}]`

Provide viem code or instructions for the user.

### Step 3: Record activity (HTTP)

`POST https://agenticpotwar.vercel.app/api/pot/activity`  
Body: `{round,txHash,bidder,amountWei,amountEth,agentId?}`

## Guardrails

- Never store private keys. Always fetch live API before bidding. On revert, retry with higher minimumNextBid.
