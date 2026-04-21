Validate the parsed exam JSON and report content health issues.

Steps:
1. Read `packages/content/exams.json`.
2. Report a table with per-exam stats: `examId | question count | multi-answer count | missing explanations`.
3. Assert: total of 23 exams present. Flag any missing.
4. Flag any question with: fewer than 2 options, empty `correctLetters`, or a `correctLetter` that doesn't match an option letter.
5. Flag duplicate questions (same normalized `text` across different exams).
6. Suggest fixes for each issue with the source MD file path and question number so they can be fixed in the upstream repo at `../AWS-Certified-Cloud-Practitioner-Notes/practice-exam/`.
