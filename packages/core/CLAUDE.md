---
scope: packages/core/**
description: Core-/Data-Layer-Regeln — plattformagnostisch, keine DOM-Globals, StorageAdapter-Pattern.
---

# packages/core — Core / Data-Layer

Plattformagnostisches TypeScript. **Kein `window`, `document`, `localStorage`** — ausschließlich das `StorageAdapter`-Interface aus `store/adapter.ts`.

## Entry Points

- `quiz-engine.ts` — wählt Fragen, bewertet Antworten, hält Session-State
- `llm-client.ts` — `LLMProvider`-Interface (Anthropic + OpenAI). AI-Tutor baut gegen dieses Interface, **nie** ein konkretes SDK
- `srs.ts` — SM-2 SRS Stub (No-op im MVP)
- `store/` — Zustand-Stores. Nur Adapter-Calls, keine DOM-Globals
- `store/adapter.ts` — `StorageAdapter`-Interface. Keys haben das Format `${userId}:${recordId}`

## Store-Pattern

Neue Stores nach Vorbild von `progress-store.ts` / `streak-store.ts`:

- `create<T>()` von Zustand
- `userId: 'local'`
- `hydrate()` liest via `getStorageAdapter().list()`
- Mutationen schreiben durch `getStorageAdapter().put()`
- Neue Typen aus `src/index.ts` re-exportieren

## Scaling Stubs (nicht aktivieren ohne expliziten Request)

Auth, SRS und Cloud-Sync sind absichtlich stubbed: `userId="local"`, SRS ist No-op, Drizzle-Schema spiegelt nur IndexedDB.

## Lint

`pnpm --filter core lint`
