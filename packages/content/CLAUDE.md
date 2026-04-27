---
scope: packages/content/**
description: Content-Pipeline-Regeln — MD → JSON Parser, Question-Schema, Slash-Commands.
---

# packages/content — Content-Pipeline

Build-time MD → JSON Parser. Generierter Output liegt in `dist/` — **nie direkt lesen** (200–800 KB pro Datei).

## Public API

Immer über den typisierten Barrel:

```ts
import { SECTIONS, EXAMS } from '@repo/content';
```

## Pipeline

Quelle: `../AWS-Certified-Cloud-Practitioner-Notes/`

- `sections/*.md` → `dist/sections.json`
- `practice-exam/practice-exam-*.md` → `dist/exams.json`

Nach Quell-Änderungen: `/parse-content`. Zur Validierung: `/check-exams`.

## Question-Schema

`examId`, `number`, `text`, `options[]`, `correctLetters[]`,
optional `explanation`, optional `topics[]`.

## Lint

`pnpm --filter content lint`
