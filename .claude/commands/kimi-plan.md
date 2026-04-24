Erstelle einen Kimi-K2-Implementierungsplan für die vom Nutzer beschriebene Aufgabe.

Schritte:
1. Lies CLAUDE.md und identifiziere, welche Entry-Point-Dateien für die Aufgabe relevant sind (Tabelle "Read These First"). Beachte strikt die "Do Not Read"-Liste.
2. Lies diese relevanten Entry-Point-Dateien. Erstelle außerdem einen kurzen Tree-Ausschnitt der betroffenen Verzeichnisse (max. 2 Ebenen tief).
3. Wähle einen kurzen, beschreibenden Slug für die Aufgabe (kebab-case, max. 40 Zeichen).
4. Baue den STDIN-Input für das Bridge-Skript als zusammenhängenden Text mit diesem Format:
   ```
   AUFGABE:
   <die Nutzerfrage / das Feature-Request>

   REPO-KONTEXT:
   <Inhalte der relevanten Entry-Point-Dateien mit Dateipfad-Überschriften>
   <Tree-Ausschnitt der betroffenen Verzeichnisse>

   REPO-REGELN (nicht im Plan verletzen):
   - Niemals öffnen: packages/content/dist/*.json, node_modules/, .next/, .turbo/, dist/, build/
   - Imports aus @repo/content, nie direkte JSON-Reads
   - grep/rg immer mit --glob '!{node_modules,.next,dist,build,.turbo}'
   - Lint nur per: pnpm --filter <workspace> lint
   ```
5. Rufe das Bridge-Skript auf:
   `echo "<obiger STDIN-Text>" | node .claude/bridges/kimi-bridge.mjs plan .claude/plans/kimi-<slug>.md`
   Oder nutze eine temporäre Datei als STDIN-Quelle wenn der Kontext sehr lang ist:
   `node .claude/bridges/kimi-bridge.mjs plan .claude/plans/kimi-<slug>.md < /tmp/kimi-input.txt`
6. Lies die erzeugte Plan-Datei und zeige dem Nutzer:
   - Den Dateipfad
   - Eine 3-5-Zeilen-Zusammenfassung des Plans (was ändert sich wo)
   - Die "Open questions"-Sektion, falls vorhanden
7. Frage explizit: "Soll ich diesen Plan umsetzen?" — nicht automatisch loslegen.
