# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

**AWS Prep Buddy** — a Mobile-First PWA for daily AWS Certified Cloud Practitioner (CLF-C02) exam preparation. Content (study notes + 23 practice exams) is sourced from the sibling repo at `../AWS-Certified-Cloud-Practitioner-Notes/`.

## Do Not Read

Never open these paths — they are either generated artifacts (large), compile output, or noise:

- `packages/content/dist/*.json` — generated, 200–800 KB each; use `import { SECTIONS, EXAMS } from '@repo/content'` instead
- `packages/content/build/**` — TypeScript compile output
- `node_modules/`, `.next/`, `.turbo/`, `dist/`, `build/`
- `pnpm-lock.yaml` — unless the task is specifically about dependencies
- `../AWS-Certified-Cloud-Practitioner-Notes/` — raw Markdown source; only needed when changing the parser

## Read These First

Jump directly to these files per task category instead of exploring:

| Task | Entry point |
|------|-------------|
| Quiz logic | `packages/core/src/quiz-engine.ts` |
| Storage / settings | `packages/core/src/store/` |
| AI-Tutor (server) | `apps/web/src/app/api/tutor/route.ts`, `packages/core/src/llm-client.ts` |
| Screens / UI | `apps/web/src/components/screens/` |
| Content parser | `packages/content/parser/` |

## Repository Layout

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
pnpm dev                            # run web app (http://localhost:3000)
pnpm --filter content build         # parse MD → JSON (run after content changes)
pnpm --filter <workspace> lint      # lint one workspace (not global — too slow)
pnpm --filter web test -- <pattern> # run a single test file
```

## Content Pipeline

Source Markdown lives in `../AWS-Certified-Cloud-Practitioner-Notes/`:
- `sections/*.md` → `packages/content/dist/sections.json`
- `practice-exam/practice-exam-*.md` → `packages/content/dist/exams.json`

Run `/parse-content` after source Markdown changes. Run `/check-exams` to validate.

**Question schema**: `examId`, `number`, `text`, `options[]`, `correctLetters[]`, optional `explanation`, optional `topics[]`.

## Core Packages

### `packages/core`
- `quiz-engine.ts` — selects questions, scores answers, tracks session state
- `llm-client.ts` — `LLMProvider` interface (Anthropic + OpenAI); AI-Tutor is built against this interface, never a concrete SDK
- `srs.ts` — SM-2 spaced repetition stub (no-op in MVP)
- `store/` — Zustand stores; **no `window`/`document`/`localStorage`** here, only adapter calls

### `packages/content`
Exports `SECTIONS` and `EXAMS` as typed constants. Always import from here; never read the dist JSON directly.

## LLM / AI-Tutor

Server-side only. API route at `apps/web/src/app/api/tutor/route.ts` handles streaming (SSE).

- Uses **Anthropic Prompt Caching** for the context block.
- Key resolution order: `X-LLM-Key` header (BYOK) → `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` env vars.
- Client BYOK keys are stored encrypted in IndexedDB (Dexie) and sent as request headers.

## Scaling Stubs

Auth/SRS/Cloud-Sync are intentionally stubbed (`userId="local"`, SRS is a no-op, Drizzle schema mirrors IndexedDB). Do not activate without an explicit request.

## Token Discipline

- Never read `exams.json` or `sections.json` directly — always use typed imports from `@repo/content`.
- Grep/find must include exclusions: `rg --glob '!{node_modules,.next,dist,build,.turbo}'`
- Lint only the changed workspace: `pnpm --filter <workspace> lint`, never `pnpm lint` globally.
- For commands expected to produce > 200 lines (builds, installs, tests): pipe through `2>&1 | tail -80`.

## Environment Variables

```
# apps/web/.env.local
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
```
