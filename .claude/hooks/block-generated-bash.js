#!/usr/bin/env node
// PreToolUse/Bash — block cat/head/tail on generated content artifacts
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const cmd = input.tool_input?.command ?? '';

if (/\b(cat|head|tail|less|open)\b/.test(cmd) && /packages\/content\/(dist|build)\//.test(cmd)) {
  process.stdout.write(JSON.stringify({
    continue: false,
    stopReason: `Blocked: reading packages/content/dist|build via shell burns 200–800 KB of tokens. Use TypeScript imports instead:\n  import { SECTIONS, EXAMS } from '@repo/content'`
  }));
}
