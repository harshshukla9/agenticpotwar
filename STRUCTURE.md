# Project structures

```
potwararbitrum/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                 # Home (frame / miniapp entry)
│   ├── globals.css
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard route → renders DashboardPage
│   └── api/                     # API routes (webhook, og, etc.)
├── components/
│   ├── ui/                      # Primitive UI (Radix + CVA)
│   │   ├── alert-dialog.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── progress.tsx
│   │   ├── table.tsx
│   │   └── tooltip.tsx
│   ├── sections/                # Feature sections (dashboard content)
│   │   ├── index.ts
│   │   ├── pools-section.tsx
│   │   ├── profile-section.tsx
│   │   ├── leaderboard-section.tsx
│   │   ├── saving-streak-section.tsx
│   │   ├── transaction-history-section.tsx
│   │   ├── previous-pools-section.tsx
│   │   └── tickets-section.tsx  # DepositsSection
│   ├── forms/
│   │   ├── index.ts
│   │   └── deposit-form.tsx     # DepositForm (buy tickets)
│   ├── dashboard/
│   │   ├── index.ts
│   │   └── dashboard-page.tsx    # Main dashboard layout + tabs
│   ├── pages/                   # Full-page wrappers (e.g. app.tsx)
│   ├── providers.tsx
│   └── ...
├── lib/
│   ├── utils.ts                 # cn() (clsx + tailwind-merge)
│   ├── constants.ts
│   ├── kv.ts
│   └── notifs.ts
├── utils/
│   └── timeUtils.ts             # getTimeUntilNextSunday()
├── types/
│   └── index.ts
├── package.json
├── tsconfig.json                 # Paths: @/* and ~/* → ./
└── STRUCTURE.md
```

## Path aliases

- `@/` and `~/` both resolve to the project root (e.g. `@/components/ui/button`, `~/lib/utils`).

## Main entry points

- **Home:** `app/page.tsx` → `components/pages/app.tsx`
- **Dashboard:** `app/dashboard/page.tsx` → `components/dashboard/dashboard-page.tsx` (uses `components/sections` and `components/forms`).
