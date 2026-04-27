---
scope: apps/web/**
description: Web-App-Regeln — AI-Tutor-Endpoint, Dexie-Adapter, BYOK, Env-Vars, Mobile-First-Viewport.
---

# apps/web — Next.js 15 Web-App

Mobile-First PWA, Referenz-Viewport **375×812**. Stil an existierenden Screens orientieren — siehe `HomeScreen.tsx`, `LearnIndexScreen.tsx`.

## AI-Tutor (Server-only)

- Route: `src/app/api/tutor/route.ts` — SSE-Streaming
- **Anthropic Prompt Caching** für den Kontext-Block aktiv halten
- Key-Resolution: `X-LLM-Key`-Header (BYOK) → `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` Env-Vars
- Client-BYOK-Keys: verschlüsselt in IndexedDB (Dexie), als Request-Header gesendet
- Nie API-Keys loggen

## Storage / Dexie

`src/lib/store/dexie-adapter.ts` — beim Hinzufügen neuer Tables Schema-Version hochzählen und put/get/list/delete/clear verdrahten.

## Env-Vars

```
# apps/web/.env.local
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
```

## Lint

`pnpm --filter web lint`
