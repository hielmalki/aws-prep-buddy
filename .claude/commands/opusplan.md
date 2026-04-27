Lässt Opus 4.7 die Aufgabe analysieren und planen, dann setzt Sonnet 4.6 um.

Aufruf: `/opusplan <aufgabe>`

Schritte:
1. Spawne den Subagent `planner-opus` (Modell Opus 4.7) mit der vom User in den Argumenten beschriebenen Aufgabe. Übergib vollständigen Kontext: den Aufgabentext, relevante Repo-Bereiche, ggf. konkrete Dateipfade aus dem User-Prompt.
2. Sobald der Plan zurückkommt: lies ihn aufmerksam.
3. Wenn unklar oder riskant → stelle dem User Rückfragen, bevor du implementierst.
4. Wenn klar → setze den Plan **als Sonnet** in dieser Session schrittweise um. Lints/Tests am Ende laufen lassen (`pnpm --filter <ws> lint` etc.).

Hinweise:
- Plan-Mode steuert der User selbst per `Shift+Tab` — kein automatischer Plan-Mode-Switch.
- Repo-Regel „nie mit Opus coden": Opus bleibt rein analytisch, Sonnet schreibt allen Code.
