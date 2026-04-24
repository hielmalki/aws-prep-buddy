# Learn-Tab Entwicklungsplan

> Status: Planung abgeschlossen  
> Ziel: Der Learn-Tab wandelt sich von einer Demo-Seite mit "Content coming soon"-Stubs in eine vollwertige, personalisierte Lernplattform, die nahtlos mit dem Quiz-Flow verbunden ist.

---

## 1. Architekturentscheidungen

### 1.1 Markdown-Rendering: Eigener kleiner Parser (Build-Zeit)

**Begruendung:** Die App verwendet keine externe UI-Library (alles hand-rolled Inline-Styles). `react-markdown` wuerde das Bundle aufblaehen. Die Markdown-Inhalte sind strukturell einfach.

**Umsetzung:** In `parseSection.ts` wird Markdown in `SectionBlock[]` geparsed:

```ts
type SectionBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language?: string; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'blockquote'; text: string };
```

Der Renderer iteriert ueber die Blocks mit den bestehenden Theme-Tokens. Keine neue Runtime-Dependency.

### 1.2 Modul-Quiz: Bestehende `/quiz` erweitern

**Begruendung:** Quiz-Logik ist komplex (`quiz-engine.ts`, `quiz-store.ts`). Neue Route = massive Duplikation.

**Umsetzung:** `QuizScreen` akzeptiert optionalen `module` Query-Parameter (`/quiz?module=compute`). `selectQuestions` filtert nach `moduleForQuestion()`. Strategy wird erweitert, nicht ersetzt.

### 1.3 SRS: Neue Dexie-Tabelle `srsCards`

**Begruendung:** SRS-Daten haben ein anderes Lifecycle als historische Antworten. Separate Tabelle erlaubt effizientes Querying.

**Schema:**
```ts
interface SrsCard {
  id: string;              // "${examId}:${questionNumber}"
  examId: number;
  questionNumber: number;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewAt: number;
  createdAt: number;
}
```

### 1.4 Topic-Accuracy: Global aggregiert

**Begruendung:** Nutzer will wissen, wie gut er "EC2" generell beherrscht, nicht nur in Exam 3.

**Umsetzung:** `topicAccuracy` im `ProgressStats` wird global ueber alle 23 Exams aggregiert.

---

## 2. Datenmodell-Erweiterungen

### 2.1 `packages/content/src/types.ts`

```ts
export type SectionBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language?: string; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'blockquote'; text: string };

export interface Section {
  slug: string;
  title: string;
  body: string;            // raw markdown (Abwaertskompatibilitaet)
  blocks: SectionBlock[];  // NEU
  topics: string[];
}
```

### 2.2 `packages/content/src/parseSection.ts`

Erweitern um Markdown-to-Blocks-Parser. Unterstuetzt:
- `# ## ###` -> `heading`
- Absaetze -> `paragraph`
- Fenced code blocks -> `code`
- Listen -> `list`
- Blockquotes -> `blockquote`
- Inline: `**bold**`, `*italic*`, `` `code` ``, `[text](url)`

Laueft zu 100% zur Build-Zeit (`npm run content:build`).

### 2.3 `packages/core/src/store/progress-store.ts`

```ts
export interface ProgressStats {
  totalAnswered: number;
  todayAnswered: number;
  correctCount: number;
  avgScore: number;
  lastExamId: number | null;
  lastQuestionNumber: number | null;
  topicAccuracy: Record<string, { correct: number; total: number }>;  // JETZT BEFUELLT
}
```

`computeStats()` erweitern: fuer jeden Record die Frage laden, ueber `question.topics` iterieren, `correct`/`total` inkrementieren. Nur beantwortete Fragen zaehlen.

**Achtung Circular Dependency:** `core` importiert `content` bereits indirekt. Falls Problem: `computeStats` akzeptiert `getQuestionFn` als Parameter.

### 2.4 `packages/core/src/store/srs-store.ts` (NEU)

```ts
interface SrsState {
  cards: Record<string, SrsCard>;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  schedule: (examId: number, questionNumber: number, quality: number) => Promise<void>;
  dueCards: () => SrsCard[];
  dueCount: () => number;
}
```

**SM-2 Algorithmus (vereinfacht):**
- `quality`: 0-5 (0=fail, 5=perfect)
- Initial: `intervalDays=1`, `easeFactor=2.5`
- Erster Erfolg: `intervalDays=6`
- Danach: `intervalDays *= easeFactor`
- `easeFactor += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)`
- Min `easeFactor = 1.3`
- `nextReviewAt = now + intervalDays * 24 * 60 * 60 * 1000`

**Integration:** Nach `recordAnswer()` in `QuizScreen`/`ReviewScreen`:
```ts
const quality = isCorrect ? 5 : 0;
useSrsStore.getState().schedule(examId, questionNumber, quality);
```

---

## 3. UI-Komponenten

### SectionRenderer.tsx (NEU)
Rendert `SectionBlock[]` mit Theme-Tokens:
- heading -> `<h3>`/`<h4>`
- paragraph -> `<p>` mit Inline-Renderer fuer bold/italic/code/links
- code -> `<pre>` mit Syntax-Highlighting-Approximation (wie in ComputeContent)
- list -> `<ul>`/`<ol>`
- blockquote -> left-border accent

### ModuleProgressBadge.tsx (NEU)
Zeigt auf Learn-Index pro Modul:
- Rot (`< 60%`): "Needs practice"
- Gelb (`60-80%`): "Getting there"
- Gruen (`> 80%`): "Strong"
- Grau (keine Daten): kein Badge

### SrsReviewCard.tsx (NEU, Phase 3)
Home-Screen Karte: "12 cards due for review" -> navigiert zu `/quiz?srs=true`.

---

## 4. Implementierungsphasen

### Phase 1: Echte Inhalte + Topic-Accuracy
| # | Task | Dateien |
|---|------|---------|
| 1.1 | Markdown-to-Blocks Parser | `packages/content/src/parseSection.ts` |
| 1.2 | `blocks` zu `Section` + `build.ts` | `packages/content/src/types.ts`, `build.ts` |
| 1.3 | `SectionRenderer` Komponente | `apps/web/src/components/ui/SectionRenderer.tsx` |
| 1.4 | `LearnModuleScreen` dynamisch umschreiben | `apps/web/src/components/screens/LearnModuleScreen.tsx` |
| 1.5 | `LearnIndexScreen` mit Topic-Accuracy Badges | `apps/web/src/components/screens/LearnIndexScreen.tsx` |
| 1.6 | `computeStats()` befuellt `topicAccuracy` | `packages/core/src/store/progress-store.ts` |
| 1.7 | Build + Dev testen | — |

**1.4 Details:**
- `sections.json` ueber `@/lib/data` laden (neu: `getSectionsForModule(mod)`)
- Filter: `mod.sectionSlugs.includes(section.slug)`
- Sortieren nach `mod.sectionSlugs`
- TOC dynamisch aus Section-Titeln
- "Quiz yourself" -> `router.push(\`/quiz?module=${mod.slug}\`)`
- `ComputeContent` KOMPLETT entfernen

**1.5 Details:**
- `useProgressStore(s => s.stats.topicAccuracy)` lesen
- Pro Modul: Accuracy ueber `mod.topicTags` aggregieren
- Badge unter Subtitle anzeigen

### Phase 2: Modul-Quiz + Quick Review
| # | Task | Dateien |
|---|------|---------|
| 2.1 | `selectQuestions` um `module`-Filter | `packages/core/src/quiz-engine.ts` |
| 2.2 | `QuizScreen` liest `module` Query-Param | `apps/web/src/components/screens/QuizScreen.tsx` |
| 2.3 | Modul-Quiz Start aus LearnModuleScreen | `LearnModuleScreen.tsx` |
| 2.4 | "Quick Review" Button in ResultScreen | `apps/web/src/components/screens/ResultScreen.tsx` |
| 2.5 | Strategy erweitern | `packages/core/src/types.ts`, `quiz-engine.ts` |

**2.1 Details:**
```ts
export function selectQuestions(
  allQuestions: Question[], strategy: Strategy, count: number,
  options?: { moduleSlug?: string }
): Question[] {
  let pool = options?.moduleSlug
    ? allQuestions.filter(q => moduleForQuestion(q).slug === options.moduleSlug)
    : allQuestions;
  // ...
}
```

**2.4 Details:**
- In `ModuleCard` neben "Learn": "Review X questions"
- Navigiert zu `ReviewScreen` mit Modul-Filter

### Phase 3: SRS + Modul-Fortschritt
| # | Task | Dateien |
|---|------|---------|
| 3.1 | `srs-store.ts` mit SM-2 | `packages/core/src/store/srs-store.ts` |
| 3.2 | Dexie-Schema: `srsCards` Tabelle | `apps/web/src/lib/store/dexie-adapter.ts` |
| 3.3 | `recordAnswer` -> `schedule()` | `QuizScreen.tsx`, `ReviewScreen.tsx` |
| 3.4 | `SrsReviewCard` auf Home | `HomeScreen.tsx` |
| 3.5 | SRS-Quiz-Modus `/quiz?srs=true` | `QuizScreen.tsx`, `quiz-engine.ts` |
| 3.6 | Modul-Fortschritt tracken | `progress-store.ts`, `LearnModuleScreen.tsx` |

**3.5 Details:**
- SRS-Quiz: nimm `dueCards()`, lade Questions, max. 20
- Nach Submit: SM-2 `schedule()`
- Ende: "All done! Next review in X days"

**3.6 Details:**
```ts
interface ModuleProgress {
  readSections: string[];
  quizAccuracy: number;
  questionsAnswered: number;
  lastStudied: number | null;
}
// In progress-store.ts:
moduleProgress: Record<string, ModuleProgress>;
markSectionRead: (moduleSlug: string, sectionSlug: string) => Promise<void>;
```
- `markSectionRead` via IntersectionObserver oder Klick auf TOC
- Learn-Index: Progress-Ring pro Modul

### Phase 4: AI Tutor Kontext + Suche
| # | Task | Dateien |
|---|------|---------|
| 4.1 | `TutorSheet` mit `context` Prop | `TutorSheet.tsx` |
| 4.2 | Floating "Ask AI" in LearnModuleScreen | `LearnModuleScreen.tsx` |
| 4.3 | Globale Suche im Learn-Tab | `LearnIndexScreen.tsx`, `SearchBar.tsx` |
| 4.4 | Bookmarks/Notizen pro Section | `progress-store.ts`, neue Dexie-Tabelle |

**4.3 Details:**
- Suche durch `LEARN_MODULES` + `sections.json`
- Filter: Modul-Titel, Section-Titel, Body
- Dropdown-Ergebnisse, Klick -> `/learn/${slug}` mit Auto-Scroll

---

## 5. Datei-Uebersicht

### Neue Dateien
```
apps/web/src/components/ui/SectionRenderer.tsx
apps/web/src/components/ui/ModuleProgressBadge.tsx
apps/web/src/components/ui/SrsReviewCard.tsx
apps/web/src/components/ui/SearchBar.tsx
packages/core/src/store/srs-store.ts
```

### Aenderungen nach Phase

**Phase 1:**
```
packages/content/src/types.ts
packages/content/src/parseSection.ts
packages/content/src/build.ts
packages/core/src/store/progress-store.ts
apps/web/src/lib/data.ts
apps/web/src/components/ui/SectionRenderer.tsx
apps/web/src/components/screens/LearnModuleScreen.tsx
apps/web/src/components/screens/LearnIndexScreen.tsx
```

**Phase 2:**
```
packages/core/src/types.ts
packages/core/src/quiz-engine.ts
apps/web/src/components/screens/QuizScreen.tsx
apps/web/src/components/screens/ResultScreen.tsx
apps/web/src/components/screens/ReviewScreen.tsx
```

**Phase 3:**
```
apps/web/src/lib/store/dexie-adapter.ts
packages/core/src/store/srs-store.ts
packages/core/src/store/progress-store.ts
apps/web/src/components/screens/HomeScreen.tsx
apps/web/src/components/screens/QuizScreen.tsx
apps/web/src/components/screens/ReviewScreen.tsx
apps/web/src/components/screens/LearnModuleScreen.tsx
```

**Phase 4:**
```
apps/web/src/components/screens/TutorSheet.tsx
apps/web/src/components/screens/LearnModuleScreen.tsx
apps/web/src/components/screens/LearnIndexScreen.tsx
packages/core/src/store/progress-store.ts
```

---

## 6. Test-Plan

### Manuelle Tests (jede Phase)
1. **Build:** `npm run content:build` -> OK, `sections.json` hat `blocks`
2. **Learn-Index:** Badges korrekt (oder keine)
3. **Learn-Modul:**
   - `compute` wie vorher, aber dynamisch
   - `security` zeigt echte Sections statt "coming soon"
   - TOC klickbar, scrollt korrekt
   - Code-Blocks formatiert
4. **Quiz-Flow:**
   - Normal-Quiz unveraendert
   - Modul-Quiz (`?module=compute`) nur Compute-Fragen
   - Result gruppiert korrekt
   - "Learn"-Button -> Modul mit echtem Inhalt
5. **SRS:**
   - Falsche Antwort -> Karte in SRS
   - Home zeigt "X cards due"
   - SRS-Quiz nur faellige Karten
   - Korrekte Antwort -> naechstes Review in Zukunft

### Edge Cases
- Modul ohne Sections: Fallback "Content coming soon"
- Question ohne Topics -> `other` Modul
- `topicAccuracy` leer: kein Crash, keine Badges
- SRS Card fuer geloeschte Frage: graceful skip
- IntersectionObserver nicht verfuegbar: Fallback-Button

---

## 7. Feature-Flags

```ts
export const FEATURES = {
  AI_TUTOR: true,      // bleibt true, Phase 4 erweitert
  SRS: false,          // -> true in Phase 3
  CLOUD_SYNC: false,
  BILLING: false,
} as const;
```

Code fuer SRS und AI_TUTOR prueft den Flag vor Rendering/Store-Actions. Jede Phase kann unabhaengig deployed werden.

---

## 8. Rollout-Reihenfolge

```
Phase 1 --> Phase 2 --> Phase 3 --> Phase 4
   |           |           |           |
   v           v           v           v
PR #1       PR #2       PR #3       PR #4
```

Jede Phase ist eine eigenstaendige PR. Phase N+1 beginnt erst nach Merge + Test von Phase N.

---

*Plan erstellt am 2026-04-24. Architekturentscheidungen sind verbindlich.*
