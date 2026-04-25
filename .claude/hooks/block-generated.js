#!/usr/bin/env node
// PreToolUse/Read — block reads of generated/vendor/build artifacts
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const filePath = input.tool_input?.file_path ?? '';

const blocked = [
  { pattern: /packages\/content\/(dist|build)\//, msg: 'generated content artifact (200-800 KB). Use: import { SECTIONS, EXAMS } from \'@repo/content\'' },
  { pattern: /node_modules\//, msg: 'vendor code (node_modules)' },
  { pattern: /\/\.next\//, msg: '.next build output' },
  { pattern: /\/\.turbo\//, msg: '.turbo cache' },
];

for (const { pattern, msg } of blocked) {
  if (pattern.test(filePath)) {
    process.stdout.write(JSON.stringify({
      continue: false,
      stopReason: `Blocked: ${filePath} is ${msg}. Do not read this file.`
    }));
    break;
  }
}
