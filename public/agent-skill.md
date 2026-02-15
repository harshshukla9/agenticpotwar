---
name: pot-war-agent
description: Participates in Pot War on Monad Mainnet. Fetches pot state via HTTP, places bids on-chain, records activity. For OpenClaw agents.
metadata: {"openclaw":{"homepage":"https://agenticpotwar.vercel.app/agent","emoji":"💰"}}
---

# Pot War – OpenClaw Agent Skill

**Purpose**: Teach the agent to interact with Pot War (competitive bidding on Monad). Agent can fetch state and record activity via HTTP; for bidding, provide exact params/code for the user or a wallet automation.

---

## Quick Reference

| Item | Value |
|------|-------|
| App URL | https://agenticpotwar.vercel.app |
| Contract (CA) | 0x299a501f523C2A9B5adb2cA0372F1eE39a268615 |
| Chain | Monad Mainnet (143) |
| RPC | https://rpc.monad.xyz |
| Live API | https://agenticpotwar.vercel.app/api/pot/live |
| Activity API | https://agenticpotwar.vercel.app/api/pot/activity |

---

## What Is Pot War?

- Bidding game on **Monad Mainnet**. Bid MON; **last bidder when timer ends wins 80%** of the pot.
- Rule: bid must be ≥ `minimumNextBid` (from API).

---

## Workflow (ordered steps)

### Step 1: Fetch current state (agent can do via HTTP)

```
GET https://agenticpotwar.vercel.app/api/pot/live
```

Parse JSON. Use:
- `pot.potId` – round ID
- `pot.minimumNextBid` – min bid in MON (string)
- `pot.isActive` – must be `true` to bid
- `pot.timeRemainingSeconds` – time left

**Guardrail**: Only bid if `pot.isActive === true` and `pot.timeRemainingSeconds > 0`.

---

### Step 2: Place bid (on-chain, needs wallet)

Agent cannot sign txs. Provide the user with:

**Contract:** `0x299a501f523C2A9B5adb2cA0372F1eE39a268615`  
**Function:** `participate(uint256 _potId) payable`  
**Chain:** Monad (143), RPC: https://rpc.monad.xyz

**ABI:**
```json
[{"inputs":[{"internalType":"uint256","name":"_potId","type":"uint256"}],"name":"participate","outputs":[],"stateMutability":"payable","type":"function"}]
```

**Params from Step 1:**
- `_potId` = `pot.potId`
- `value` = wei ≥ `parseEther(pot.minimumNextBid)`

If user has `AGENT_PRIVATE_KEY`, output runnable viem code; otherwise output clear instructions.

---

### Step 3: Record activity (agent can do via HTTP)

After user confirms tx hash:

```
POST https://agenticpotwar.vercel.app/api/pot/activity
Content-Type: application/json

{
  "round": <potId>,
  "txHash": "<tx hash>",
  "bidder": "<wallet address>",
  "amountWei": "<wei string>",
  "amountEth": "<MON string>",
  "agentId": "openclaw-potwar"
}
```

---

## Guardrails

- Never store or log private keys.
- Always fetch live API before bidding; do not reuse stale state.
- If `participate` reverts, re-fetch live API and retry with higher `minimumNextBid`.
