#!/usr/bin/env node
// PreToolUse/Read — block reads of generated content artifacts
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const filePath = input.tool_input?.file_path ?? '';

if (/packages\/content\/(dist|build)\//.test(filePath)) {
  const kind = /dist/.test(filePath) ? 'generated JSON (200–800 KB)' : 'TypeScript compile output';
  process.stdout.write(JSON.stringify({
    continue: false,
    stopReason: `Blocked: ${filePath} is ${kind}. Use TypeScript imports instead:\n  import { SECTIONS, EXAMS } from '@repo/content'`
  }));
}
