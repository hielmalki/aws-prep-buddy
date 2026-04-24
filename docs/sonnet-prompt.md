# Prompt fuer Claude Sonnet / Kimi

Implementiere **Phase 1** des Learn-Tab Roadmaps aus `docs/learn-tab-roadmap.md`.

## Was zu tun ist

1. **Markdown-to-Blocks Parser** in `packages/content/src/parseSection.ts` bauen. Parsed `sections/*.md` in `SectionBlock[]` (heading, paragraph, code, list, blockquote). Laueft zur Build-Zeit.
2. **`blocks` Feld** zu `Section`-Interface in `packages/content/src/types.ts` hinzufuegen. `build.ts` anpassen.
3. **`SectionRenderer` Komponente** in `apps/web/src/components/ui/SectionRenderer.tsx` erstellen. Rendert `SectionBlock[]` mit den bestehenden Theme-Tokens (`t.text`, `t.textMuted`, `t.accent`, `mono`). Inline-Markdown (bold, italic, code, links) im Paragraph-Block unterstuetzen.
4. **`LearnModuleScreen` umschreiben**: `ComputeContent` entfernen, stattdessen Sections aus `sections.json` dynamisch laden, filtern (nach `mod.sectionSlugs`), sortieren, mit `SectionRenderer` anzeigen. TOC dynamisch aus Section-Titeln bauen.
5. **`LearnIndexScreen` erweitern**: `topicAccuracy` aus `useProgressStore` lesen und pro Modul ein kleines Badge anzeigen (Rot/Gelb/Gruen/Grau).
6. **`computeStats()` in `progress-store.ts` erweitern**: `topicAccuracy` befuellen (global aggregiert ueber alle Fragen und ihre `topics`).

## Regeln

- **KEINE neuen npm-Dependencies** installieren. Kein `react-markdown`, kein `marked`, nichts.
- **Build-Zeit-Parser**: Der Markdown-Parser laueft in `parseSection.ts`, nicht im Browser.
- **Theme beibehalten**: Nutze die bestehenden `theme()`-Tokens und `baseFont`/`mono` aus `@/lib/theme`.
- **Feature-Flags**: Pruefe `FEATURES.SRS` vor SRS-Code (ist aktuell `false`).
- **Abwaertskompatibilitaet**: `Section.body` bleibt erhalten.
- **Nach jeder Aenderung**: `npm run content:build` und `npm run dev` testen.
- **Daten-Loader**: Wenn `@/lib/data.ts` keinen `getSections()` hat, erstelle einen. Sections kommen aus `apps/web/src/data/sections.json`.

## Akzeptanzkriterien

- [ ] `npm run content:build` laueft fehlerfrei, `sections.json` enthaelt `blocks`
- [ ] `/learn/compute` zeigt die gleichen Inhalte wie vorher, aber jetzt dynamisch aus `sections.json`
- [ ] `/learn/security` (oder jedes andere Modul) zeigt echte Sections statt "Content coming soon"
- [ ] TOC ist klickbar und scrollt zur Section
- [ ] Code-Blocks sind korrekt formatiert (wie bisher in ComputeContent)
- [ ] Learn-Index zeigt Topic-Accuracy-Badges fuer Module mit Quiz-Daten
- [ ] Normales Quiz-Flow (`/quiz`, `/quiz/result`, `/quiz/review`) funktioniert unveraendert

## Kontext

- Monorepo mit npm workspaces: `apps/web` (Next.js 15, App Router), `packages/content` (Build-Zeit Parser), `packages/core` (Zustand Stores)
- Styling: 100% hand-rolled Inline-Styles, keine Tailwind/shadcn
- State: Zustand + Dexie/IndexedDB
- Sections-Daten: `apps/web/src/data/sections.json` (~230KB Markdown)
- Der vollstaendige Plan mit allen Details steht in `docs/learn-tab-roadmap.md`
