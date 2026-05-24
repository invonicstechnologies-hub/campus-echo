ns
# Unsaid — Premium Anonymous Campus Social App (Frontend v1)

A mobile-first, dark-mode-first social product inspired by Reddit + X, polished to Emil Kowalski / 21st.dev quality. This first pass is **frontend-only with mock data** so we can nail the design system, motion, and feel before wiring backend (auth, posts, reactions can be added later via Lovable Cloud).

## Design system

- **Palette (dark-first):** near-black background `#0A0A0B`, elevated surface `#111114`, hairline borders at ~6% white, foreground near-white, muted text at ~55% white. Single expressive accent: warm coral `#FF5A4E` (used sparingly for active reactions, primary CTAs, trending). Secondary accent: soft amber for trending flame.
- **Typography:** Geist Sans (UI) + Instrument Serif (display moments like the wordmark "Unsaid" and onboarding hero). Tight tracking on large display, comfortable 15–16px feed body, 13px meta.
- **Radii:** 14px cards, 999px pills/avatars, 10px inputs.
- **Depth:** flat surfaces + 1px hairlines, soft 40px ambient shadow only on modals/sheets. Subtle backdrop-blur on sticky top bar and bottom nav only.
- **Motion (Framer Motion):** spring-based; reactions pop with overshoot, upvote count rolls with a number-flip, modals use sheet-up on mobile / scale-fade on desktop, feed items fade-up on mount, like/repost have haptic-style scale 0.92 → 1.

## Screens (routes)

```
/                       Landing / redirects to /feed
/onboarding             3-step immersive intro (Unsaid wordmark moment)
/login, /register       Minimal auth (mock submit)
/feed                   Main feed (Hot / New / Trending tabs)
/post/$id               Post detail with nested comments
/profile                Anonymous profile (your alias + activity)
/u/$alias               Public anonymous profile
/notifications          Activity inbox
```

Plus: **Create Post modal** (global, opens from FAB / + nav button) and **Report sheet** (long-press / overflow menu).

## Core components

- `AppShell` — sticky top bar (logo, search, profile), bottom nav on mobile, optional left rail on desktop ≥lg
- `BottomNav` — 5 slots: Feed, Trending, **Create (center, raised)**, Notifications, Profile; thumb-optimized, active indicator morphs
- `PostCard` — anonymous alias chip with generated avatar gradient, time, community tag, title, body preview (3-line clamp), optional image, reaction row (upvote/downvote counter, comments, repost, share), trending flame badge when hot
- `ReactionButton` — animated count, color flip on active, particle burst on first tap
- `CommentThread` — nested with continuous vertical guide lines, collapse/expand, sticky reply bar
- `CreatePostSheet` — bottom sheet (mobile) / centered modal (desktop), title + body, community picker, anonymous-by-default toggle, character counter ring
- `TrendingRail` — desktop side rail with top discussions + active communities
- `Skeletons` — shimmer post/comment skeletons
- `EmptyStates` — illustrated with copy

## Folder structure

```
src/
  routes/                feed, post.$id, profile, u.$alias,
                         notifications, onboarding, login, register
  components/
    layout/              AppShell, TopBar, BottomNav, SideRail
    feed/                PostCard, ReactionBar, TrendingBadge, FeedTabs
    post/                CommentThread, CommentItem, ReplyBar
    create/              CreatePostSheet, CommunityPicker
    profile/             AnonAvatar, ActivityStats, AliasBadge
    common/              Skeletons, EmptyState, ReportSheet
    ui/                  (shadcn primitives, already present)
  lib/
    mock-data.ts         seed posts, comments, communities, aliases
    anon.ts              alias + avatar-gradient generator
    format.ts            relative time, compact numbers
  styles.css             tokens (dark-first)
```

## Implementation order

1. **Design tokens** — rewrite `src/styles.css` dark-first with the palette, fonts (via `<link>` in `__root.tsx` head), and a few motion-friendly utilities.
2. **AppShell + BottomNav + TopBar** with sticky/blur behavior and active-route morph indicator.
3. **Mock data + helpers** (`lib/mock-data.ts`, `lib/anon.ts`, `lib/format.ts`).
4. **Feed route** with FeedTabs, PostCard, ReactionBar, skeleton loaders, fade-up entrance.
5. **Post detail** with nested CommentThread + sticky ReplyBar.
6. **Create Post sheet** (global, Framer Motion sheet/modal).
7. **Profile + public alias profile** with anonymous identity styling and activity grid.
8. **Onboarding** (3 panels, large serif moments, swipeable on mobile).
9. **Auth screens** (login/register, mock submit → /feed).
10. **Notifications + Report sheet** + polish pass (skeletons, empty states, micro-interactions, 404).
11. **SEO**: per-route `head()` metadata, `sitemap.xml`, `robots.txt`.

## Out of scope for v1 (can add next)

- Real auth, persistence, realtime — would require Lovable Cloud (ask before enabling)
- Image uploads, search results page, settings, dark/light toggle (dark-only intentionally)

## Notes

- No purple. One accent only (coral). No gradients except the per-alias avatar discs.
- All colors via semantic tokens in `styles.css` — no raw hex in components.
- One generated hero/onboarding image (subtle, abstract) via `imagegen`.
- Framer Motion already fits; will add `motion` package if not present.
