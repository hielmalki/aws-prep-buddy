# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**AWS Prep Buddy** — a Mobile-First PWA for daily AWS Certified Cloud Practitioner (CLF-C02) exam preparation. Content (study notes + 23 practice exams) is sourced from the sibling repo at `../AWS-Certified-Cloud-Practitioner-Notes/`.

## Repository Layout (Turborepo Monorepo)

```
aws-prep/
├── apps/
│   ├── web/          # Next.js 15 (App Router) PWA — the active app
│   └── mobile/       # Expo app (Phase 3, not yet built)
├── packages/
│   ├── content/      # Build-time MD → JSON parser + generated JSON data
│   ├── core/         # Platform-agnostic logic: quiz engine, LLM client, Zustand stores
│   └── ui/           # Shared UI primitives (Phase 3)
└── turbo.json
```

## Commands

```bash
pnpm install                        # install all workspaces
pnpm dev                            # run web app (http://localhost:3000)
pnpm --filter web dev               # same, explicit
pnpm --filter content build         # parse MD → JSON (run after content changes)
pnpm build                          # build all packages + web app
pnpm lint                           # lint all workspaces
pnpm test                           # run all tests
pnpm --filter web test -- <pattern> # run a single test file
```

## Content Pipeline

Source Markdown lives in `../AWS-Certified-Cloud-Practitioner-Notes/`:
- `sections/*.md` → parsed to `packages/content/sections.json`
- `practice-exam/practice-exam-*.md` → parsed to `packages/content/exams.json`

The parser (`packages/content/parser/`) runs at build time. It replicates the AWK question-parsing logic from `../AWS-Certified-Cloud-Practitioner-Notes/practice-exam/search_questions.sh` in TypeScript. Run `pnpm --filter content build` after the source Markdown changes.

**Question schema**: each question has `examId`, `number`, `text`, `options[]` (letter + text), `correctLetters[]`, optional `explanation`, optional `topics[]`.

## Core Packages

### `packages/core`
- `quiz-engine.ts` — selects questions, scores answers, tracks session state
- `llm-client.ts` — `LLMProvider` interface with Anthropic and OpenAI implementations; the AI-Tutor feature is built against this interface, never against a concrete SDK
- `srs.ts` — SM-2 spaced repetition stub (no-op in MVP, real implementation in Phase 2)
- `store/` — Zustand stores; **no `window`/`document`/`localStorage` references** here, only adapter calls, so these stores run in both Next.js and Expo

### `packages/content`
Exports `SECTIONS` and `EXAMS` as typed constants. Import from here, never read MD files at runtime.

## LLM / AI-Tutor

Server-side only. API route at `apps/web/app/api/tutor/route.ts` handles streaming (SSE).

- Injects relevant section markdown as context into the system prompt.
- Uses **Anthropic Prompt Caching** for the context block to reduce costs.
- Provider and API key are resolved in this order: request header (BYOK) → `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` env vars.
- Client-stored BYOK keys (encrypted in IndexedDB via Dexie) are sent as `X-LLM-Key` and `X-LLM-Provider` headers.

## Scaling Stubs (not active in MVP)

These patterns are intentionally in place to avoid future rewrites:
- **Auth**: all Zustand progress records keyed by `userId` (defaults to `"local"`).
- **SRS**: `srs.recordAnswer()` is called by the quiz engine but is a no-op until Phase 2.
- **Feature flags**: `packages/core/features.ts` exports a `FEATURES` constant; AI-Tutor is gated behind `FEATURES.AI_TUTOR` (set to `true` for now).
- **Cloud sync**: Drizzle schema mirrors the IndexedDB schema; sync adapter is a stub.

## Environment Variables

```
# apps/web/.env.local
ANTHROPIC_API_KEY=...   # server-side fallback key
OPENAI_API_KEY=...      # server-side fallback key
```

Users can supply their own keys in Settings; those are stored in-browser and never hit the server persistently.
