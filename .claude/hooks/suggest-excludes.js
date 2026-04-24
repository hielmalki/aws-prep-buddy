#!/usr/bin/env node
// PreToolUse/Bash — block grep/find/rg without directory exclusions
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const cmd = input.tool_input?.command ?? '';

// Only flag broad recursive searches (not targeted single-file greps)
const isBroadSearch = /\b(grep\b.*-r|-r\b.*grep\b|find\s+\.(\s|$)|rg\s+)/.test(cmd);
const hasExclude = /(node_modules|\.next|dist\b|build\b|\.turbo)/.test(cmd);

if (isBroadSearch && !hasExclude) {
  process.stdout.write(JSON.stringify({
    continue: false,
    stopReason: [
      'Search command is missing exclusions — will hit node_modules/.next/dist/build and waste tokens.',
      'Add exclusions:',
      '  rg:   --glob \'!{node_modules,.next,dist,build,.turbo}\'',
      '  grep: --exclude-dir={node_modules,.next,dist,build}',
      '  find: -not -path \'*/node_modules/*\' -not -path \'*/.next/*\' -not -path \'*/dist/*\''
    ].join('\n')
  }));
}
