# Task 2-f — Admin Panel (Qabiltoo Operations)

Agent: full-stack-developer
Status: COMPLETE

## What was built

All inside `src/components/qabiltoo/admin/` (no files outside this folder were edited):

| File | Purpose |
|---|---|
| `admin-view.tsx` | Rewritten. Dark emerald-950 "Operations" header (ShieldCheck mark, gold-gradient "Operations", arabic العمليات, "Demo environment — sample data" note, hydration-safe live clock, Live pulse, spinning Refresh invalidating all `["admin"]` queries, Exit console → navigate). shadcn Tabs live in the dark header with gold active triggers, live count pills, horizontal scroll on mobile. |
| `kit.tsx` | Admin-local types (AdminVerification/AdminReport with nested profile, reviewedAt/resolvedAt), `useAdminStats` (10s refetch, shared key), `timeAgoLong`, AdminAvatar/StoryThumb (next/image + onError fallback → /api/avatar/initials or Gem), TierBadge, LiveChip, isSevereReason, REPORT_ACTION_META, EmptyState. |
| `overview-tab.tsx` | 8 CountUp stat cards (2×4, gold/rose tints, framer stagger, reduced-motion aware), recharts BarChart 7-day signups (emerald bars, gold today bar, dark custom tooltip), gender donut (gold/emerald, center total), shared TrustRing verified share, quick-action buttons → jump tabs, skeletons + error Alert w/ retry. |
| `verifications-tab.tsx` | Pending queue (15s refetch, max-h-96 scrollbar-thin): avatar, name, TierBadge, city, submitted timeAgo, docType + mono docRef; optimistic Approve (gold) / Reject (outline destructive) → PATCH → spec toasts; error rollback. "Recently reviewed" (top 6 non-pending) with status chips + reviewedAt. |
| `moderation-tab.tsx` | Open report cards (15s): reason bold, "Priority" rose chip + rose border for severe reasons, details, reported profile, reporter, timeAgo; Warn/Suspend/Ban/Dismiss → PATCH, per-button loader, action-specific toasts. Collapsible "Resolved reports" with action chips (warned/suspended/banned/no-action). |
| `content-tab.tsx` | Stories table-rows: thumb, coupleNames/title, city+marriedAt, Featured (gold) + Approved switches (optimistic override + rollback), Delete via AlertDialog → DELETE. "Add story" Dialog: full form, validated Publish gating, 5-thumbnail image picker (success-couple-1..5.png). FAQ: read-only note card mirroring the 6 published questions. |

## Verification results

- `bun run lint` (whole project): clean.
- Browser-verified (agent-browser, 1440px + 390px): demo login → user menu → Admin; approve/reject, dismiss, featured toggle round-trip, dialog validation, AlertDialog cancel — all pass with toasts + instant invalidation; zero page errors, zero console messages; VLM screenshot QA clean (desktop/charts/mobile).
- curl: `/api/admin/stats`, `/api/admin/verifications?status=pending`, `/api/admin/reports?status=open`, `/api/admin/stories` all 200; `/` → 200. dev.log free of admin-related errors.
- DB restored to pristine seed state after testing (4 pending verifications, 2 open reports, 5 notifications; Nabeel profile back to blue/69/unverified; test revert script deleted).

## Notes for other agents

- Shared admin query namespace is `["admin", ...]` — invalidate `["admin"]` to refresh everything.
- Missing images from Task-2 background generation (success-couple-4/5, profile-f5..f10/m5..m10) degrade gracefully here via StoryThumb/AdminAvatar fallbacks.
- The only cross-folder dependency I consume (read-only): shared CountUp, TrustRing, VERIFICATION_TIER_META, initialsOf, ui/* components, toast hook.
