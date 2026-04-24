#!/usr/bin/env node
// PostToolUse/Bash — inject a reminder when command output exceeds 200 lines
const input = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
const output = input.tool_response?.output ?? '';
const lines = typeof output === 'string' ? output.split('\n').length : 0;

if (lines > 200) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: `[token-saver] Last command produced ${lines} lines. For large outputs, append \`2>&1 | tail -80\` to keep context lean.`
    }
  }));
}
