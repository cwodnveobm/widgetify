# Plan

## Phase 1 — End-to-end audit (this turn)
Run Playwright headless across the core routes against the live preview, capturing console errors, network failures, and screenshots:

- `/`, `/dashboard`, `/embed-widgets`, `/lastset`, `/l/:demo`, `/w/:demo`, `/mcp-docs`, `/embed-docs`, `/use-cases`, `/admin`, `/referrals`, `/payment-history`, `/support`, `/marketplace`, `/ab-testing`, `/creator-portal`, `/custom-builder`, `/integrations`, `/faq`

For each issue found:
1. Triage (broken route / runtime error / RLS denial / layout break / a11y)
2. Fix in place
3. Re-verify with a second Playwright pass

Also run `supabase--linter` and resolve any new advisories from recent migrations.

## Phase 2 — Telegram notifications (blocked)
Already implemented end-to-end. Needs **only** your numeric chat ID via @userinfobot. Once you paste it, I'll update the `TELEGRAM_ADMIN_CHAT_ID` secret and send a verification ping.

## Phase 3 — Gen-Z UX modernization
After the audit is clean, I'll propose **3 rendered design directions** focused on:
- Bolder type system (variable display font, tighter tracking)
- Motion-first interactions (Framer Motion micro-interactions, scroll-driven reveals)
- Tactile glass/neon hybrid surfaces
- Command-palette-style nav, sticker/badge accents

You pick one direction, I implement it across landing + dashboard + LastSet. No backend changes.

## Phase 4 — Self-managed Supabase migration (manual, out of band)
This can't be automated from inside Lovable Cloud. When you're ready I'll deliver:
1. A single consolidated SQL file (tables + RLS + grants + functions + triggers) to paste into the new project's SQL editor.
2. A checklist of all ~20 edge functions with required secrets and deploy commands.
3. Storage bucket recreation script.
4. Step-by-step swap instructions for `client.ts` / `.env`.

You run it against your new Supabase project, then phone auth (Twilio/MessageBird) becomes a dashboard toggle on your side.

## What I need from you to keep moving
1. **Numeric Telegram chat ID** (from @userinfobot) — unblocks Phase 2.
2. **Approval to start Phase 1 audit now** — I'll begin as soon as you confirm.
3. **Green light on Phase 4 timing** — say the word when you've created the new Supabase project and I'll generate the migration bundle.
