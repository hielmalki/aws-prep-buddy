# CLAUDE.md

**AWS Prep Buddy** — Mobile-First PWA für tägliche AWS CLF-C02-Prüfungsvorbereitung.
Content stammt aus dem Schwester-Repo `../AWS-Certified-Cloud-Practitioner-Notes/`.

## ⛔ Do Not Read

- `packages/content/dist/*.json` — generiert, 200–800 KB. Stattdessen: `import { SECTIONS, EXAMS } from '@repo/content'`
- `packages/content/build/**` — TypeScript-Compile-Output
- `node_modules/`, `.next/`, `.turbo/`, `dist/`, `build/`
- `pnpm-lock.yaml` — nur bei Dependency-Aufgaben
- `../AWS-Certified-Cloud-Practitioner-Notes/` — nur wenn der Parser geändert wird

## 🎯 Read These First

Direkt zum Entry-Point springen statt zu erkunden. Nested `CLAUDE.md` enthält die subsystem-spezifischen Regeln und wird beim Arbeiten im jeweiligen Subtree geladen — bei Bedarf explizit lesen.

| Task | Entry point | Subsystem-Regeln |
|------|-------------|------------------|
| Quiz-Logik | `packages/core/src/quiz-engine.ts` | `packages/core/CLAUDE.md` |
| Storage / Settings | `packages/core/src/store/` | `packages/core/CLAUDE.md` |
| AI-Tutor (Server) | `apps/web/src/app/api/tutor/route.ts` | `apps/web/CLAUDE.md` |
| Screens / UI | `apps/web/src/components/screens/` | `apps/web/CLAUDE.md` |
| Content-Parser | `packages/content/parser/` | `packages/content/CLAUDE.md` |

## Repo-Layout

```
apps/web/         Next.js 15 (App Router) PWA — die aktive App
apps/mobile/      Expo (Phase 3, noch nicht gebaut)
packages/content  MD → JSON Parser + generierte Daten
packages/core     Quiz-Engine, LLM-Client, Zustand-Stores
packages/ui       Shared UI-Primitives (Phase 3)
```

## Tägliche Commands

```bash
pnpm dev                            # Web-App auf :3000
pnpm --filter <ws> lint             # nur einen Workspace linten — NIE global
pnpm --filter <ws> test -- <p>      # einzelnen Test laufen lassen
pnpm --filter content build         # Content nach MD-Änderungen neu bauen
```

## Token-Discipline (repo-weit)

- Nie `exams.json` / `sections.json` direkt lesen — immer typisierte Imports aus `@repo/content`
- Suche **muss** Exclusions enthalten: `rg --glob '!{node_modules,.next,dist,build,.turbo}'`
- Lint per-Workspace, nie `pnpm lint` global
- Lange Outputs (Builds, Installs, Tests) durch `2>&1 | tail -80` pipen

## Coding-Regel

Nie mit Opus coden. Coden nur mit Sonnet erlaubt.
