# Task 2-c — Discover + Profile Detail (full-stack-developer)

## Files rewritten (scope: src/components/qabiltoo/browse/ + profile/ only)
- `browse/browse-view.tsx` — Discover experience
- `browse/profile-card.tsx` — ProfileCard / ProfileCardRow / CuratedProfileCard
- `profile/profile-detail-view.tsx` — Profile detail experience
- `profile/send-interest-dialog.tsx` — NOT touched (read-only per rules)

## What shipped
### Discover
- Header: SectionHeading (arabic "اكتشف", eyebrow "Discover", title "Profiles prepared with sincerity") + LayoutGrid/List view toggle (segmented), quick search, Everyone/Brides/Grooms tabs.
- "Today's Matches for You" carousel: `/api/profiles?sort=trust&limit=8`, snap-x + scrollbar-thin, chevron scroll buttons, alternating 3D card-stack deck layers + ParallaxCard hover, "Curated daily by our moderation team" note.
- Filters (desktop sticky sidebar w-72 / mobile full-height Sheet, count badge): q, gender, age 18–75 selects, city (stats cityNames), country (limit=48 lookup, staleTime 5min), maritalStatus, sect, education + profession text (contains), income INCOME_BRACKETS, relocate Switch, verificationTier Blue/Green/Gold chips (single-select, tier color + glow), sort recent/trust/active. All live via 300ms debounced TanStack Query; result count aria-live; Reset; shape-matched skeletons; empty/error states; server-side pagination with ellipsis.

### Profile detail
- View POST once (ref guard, user && !own; re-fires if user signs in mid-view).
- Gallery: photos[] arch frame + thumbnails + AnimatePresence zoom lightbox; unblurred unless `tier==="blue" && !idVerified` → BlurredPhoto "Photo visible after basic verification".
- Rail: displayName, VerificationBadge glow, tier chip (Gold gradient+Gem / Platinum blush), TrustRing, "Active Xh ago", 8 quick-fact tiles, gold Send Proposal (btn-gold-shimmer + 3s subtle pulse; disabled "Proposal Sent"/"Your Profile"), Save for Later.
- Sections: Religious Practice icon grid (hijab/beard label adapts), About, Partner Preference (gold left-border quote), Family Background, Wali card (ShieldCheck, masked phone "+91 98200 •• ••23" style, "contact shared after proposal accepted"), Report Dialog (6 enum reasons + details → POST /api/reports → toast) + Block (client-side).

## Robustness
- Missing images (profile-f5..f10 / m5..m10 not on disk) → onError fallback to `/api/avatar/{initials}` in both views.

## Verification performed
- `bun run lint` — clean (whole project).
- curl: `/api/profiles?verificationTier=gold&limit=2` 200; `/` 200; `/api/profiles/[id]` 200; dev.log clean.
- agent-browser: filters live-update (20→10 brides, 7 gold), list/grid, pagination, curated carousel, lightbox, report submit (toast + DB row, then removed), own-profile state, unverified blur, wali mask; 390px mobile sheet + stacked cards; zero page errors.
- DB restored to pristine: deleted 1 test report + 3 test ProfileView rows (20 profiles / 3 reports / 10 views / interests untouched).

## Notes for other agents / main
- Do not reveal profile photos on browse — use BlurredPhoto (privacy rule).
- `timeAgo` returns date strings >30d; use `lastActiveLabel` pattern from profile-detail-view if you need "Active X ago".
- Pre-existing issues outside my scope (from 2-b): socket.ts ref-in-render lint warning; qabiltoo-app.tsx `view.name === "matches"` TS comparison. Untouched.
