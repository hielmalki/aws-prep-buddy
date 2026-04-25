#!/usr/bin/env node
// PostToolUse/Bash — truncate command output to last 80 lines when it exceeds 200
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const output = input.tool_response?.output ?? '';
const lines = typeof output === 'string' ? output.split('\n').length : 0;

if (lines > 200) {
  const truncated = output.split('\n').slice(-80).join('\n');
  process.stdout.write(JSON.stringify({
    result: `[truncated: ${lines} lines total, showing last 80]\n${truncated}`
  }));
}
