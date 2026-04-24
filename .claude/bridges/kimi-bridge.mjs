#!/usr/bin/env node
// kimi-bridge.mjs — ruft Moonshot Kimi K2 API auf und gibt Antwort auf STDOUT
// Usage: echo "<prompt>" | node kimi-bridge.mjs plan .claude/plans/kimi-slug.md
//        echo "<prompt>" | node kimi-bridge.mjs advisor

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const MOONSHOT_ENDPOINT = "https://api.moonshot.ai/v1/chat/completions";
const KIMI_MODEL = "kimi-k2-0905-preview";

const PLAN_SYSTEM_PROMPT = `You are a senior software architect acting as a planner for Claude Sonnet.
Your output will be read directly by Claude Sonnet and executed step by step.

CRITICAL RULES:
- Respond ONLY in Markdown with EXACTLY this structure:
  ## Context
  ## Files to change
  ## Step-by-step
  ## Verification
- Every step in "Step-by-step" MUST reference a concrete file path. Include function names and approximate line numbers when known.
- Do NOT add features, refactoring, or abstractions beyond the task. Stick strictly to the request.
- Do NOT wrap your entire output in a code fence.
- If information is missing, add a final section:
  ## Open questions
  List exactly what you need to know before proceeding. Do NOT guess or invent paths.
- Respond in the same language as the user prompt.`;

const ADVISOR_SYSTEM_PROMPT = `You are a senior software architect giving a second opinion.
Be concise: max 300 words. Structured bullet points preferred.
Respond in the same language as the user prompt.`;

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf-8").trim();
}

async function callKimi(systemPrompt, userContent) {
  const apiKey = process.env.MOONSHOT_API_KEY;
  if (!apiKey) {
    process.stderr.write("Fehler: MOONSHOT_API_KEY nicht gesetzt. export MOONSHOT_API_KEY=sk-...\n");
    process.exit(1);
  }

  const response = await fetch(MOONSHOT_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: KIMI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    process.stderr.write(`Moonshot API Fehler ${response.status}: ${body}\n`);
    process.exit(1);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

async function main() {
  const mode = process.argv[2]; // "plan" | "advisor"
  const outputPath = process.argv[3]; // nur bei "plan" gesetzt

  if (!mode || !["plan", "advisor"].includes(mode)) {
    process.stderr.write("Usage: echo '<prompt>' | node kimi-bridge.mjs plan <output-path>\n");
    process.stderr.write("       echo '<prompt>' | node kimi-bridge.mjs advisor\n");
    process.exit(1);
  }

  const stdin = await readStdin();
  if (!stdin) {
    process.stderr.write("Fehler: Kein Input via STDIN.\n");
    process.exit(1);
  }

  const systemPrompt = mode === "plan" ? PLAN_SYSTEM_PROMPT : ADVISOR_SYSTEM_PROMPT;
  const result = await callKimi(systemPrompt, stdin);

  if (mode === "plan" && outputPath) {
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, result, "utf-8");
    process.stdout.write(`Plan gespeichert: ${outputPath}\n`);
  } else {
    process.stdout.write(result + "\n");
  }
}

main().catch((err) => {
  process.stderr.write(`Unerwarteter Fehler: ${err.message}\n`);
  process.exit(1);
});
