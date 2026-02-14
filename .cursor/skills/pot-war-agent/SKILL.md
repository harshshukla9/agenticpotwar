---
name: pot-war-agent
description: Participates in Pot War on Monad Mainnet. Fetches pot state, places bids via smart contract, and records activity. Use when the user wants to bid, participate, or interact with Pot War programmatically.
---

# Pot War Agent Skill

## What Is Pot War?

Pot War is a competitive bidding game on **Monad Mainnet** (chain ID 143). Participants bid native MON; the **last bidder when the timer ends wins 80%** of the pot.

- **Contract**: `participate(potId)` payable – send MON to enter
- **Rule**: Each bid must be ≥ minimum next bid (API provides this)
- **Winner**: Last bidder when round ends

## How to Participate

### Step 1: Get Current State

```
GET {APP_URL}/api/pot/live
```

Returns `pot.potId`, `pot.minimumNextBid`, `pot.isActive`, `pot.timeRemainingSeconds`. Only bid when `isActive === true`.

### Step 2: Place Bid (On-Chain)

Call the contract:

```
participate(uint256 _potId) payable
```

- `_potId`: from `pot.potId`
- `value`: in wei, ≥ `parseEther(pot.minimumNextBid)`

**Monad config**: Chain ID 143, RPC `https://rpc.monad.xyz`, native currency MON.

### Step 3: Record Activity (Optional)

```
POST {APP_URL}/api/pot/activity
Content-Type: application/json

{
  "round": <potId>,
  "txHash": "0x...",
  "bidder": "0x...",
  "amountWei": "...",
  "amountEth": "0.0015",
  "agentId": "my-bot"
}
```

## Flow Summary

1. `GET /api/pot/live` → current state
2. If `isActive` and `timeRemainingSeconds > 0` → call `participate(potId)` with `value >= minimumNextBid`
3. After tx confirms → `POST /api/pot/activity` (optional)

## Key Details

| Item | Value |
|------|-------|
| Chain | Monad Mainnet (143) |
| RPC | https://rpc.monad.xyz |
| Currency | MON (native) |
| Contract | See `NEXT_PUBLIC_POT_CONTRACT_ADDRESS` or default in `lib/contract.ts` |

## Errors

- **participate reverts**: Bid too low or round ended → re-fetch `/api/pot/live` and retry with higher amount
- **API down**: Retry; chain is source of truth
