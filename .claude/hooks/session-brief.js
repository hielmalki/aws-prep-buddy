#!/usr/bin/env node
// SessionStart — inject one-time orientation brief so Claude skips re-discovery
const { execSync } = require('child_process');

let branch = 'unknown';
try {
  branch = execSync('git branch --show-current', { cwd: process.cwd(), encoding: 'utf8' }).trim();
} catch {}

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: [
      `[session-brief] branch: ${branch}`,
      'NEVER read: packages/content/dist/*.json (200-800KB), node_modules, .next, pnpm-lock.yaml',
      'Entry points: packages/core/src/quiz-engine.ts | packages/core/src/store/ | apps/web/src/components/screens/ | apps/web/src/app/api/tutor/route.ts',
      'Search: always add --glob \'!{node_modules,.next,dist,build,.turbo}\' (rg) or --exclude-dir=... (grep)'
    ].join('\n')
  }
}));
