import { readFileSync } from 'fs';
import { basename } from 'path';
import type { Section, SectionBlock } from './types.js';
import { tagTopics } from './tagTopics.js';

function parseBlocks(markdown: string): SectionBlock[] {
  const blocks: SectionBlock[] = [];
  const lines = markdown.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    const fenceMatch = line.match(/^```(\w*)$/);
    if (fenceMatch) {
      const language = fenceMatch[1] || undefined;
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: 'code', language, text: codeLines.join('\n') });
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [line.slice(2)];
      i++;
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join(' ') });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{2,6})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2].trim() });
      i++;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'list', ordered: true, items });
      continue;
    }

    // Unordered list (-, *, +) including nested (treat nested as part of parent item)
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && (/^[-*+]\s/.test(lines[i]) || /^\s+[-*+]\s/.test(lines[i]))) {
        const raw = lines[i].trimStart();
        if (/^[-*+]\s/.test(raw)) {
          items.push(raw.slice(2));
        } else {
          // nested item — append to last item
          if (items.length > 0) {
            items[items.length - 1] += ' ' + raw.replace(/^[-*+]\s+/, '');
          }
        }
        i++;
      }
      blocks.push({ type: 'list', ordered: false, items });
      continue;
    }

    // Blank line or horizontal rule — skip
    if (line.trim() === '' || /^-{3,}$/.test(line.trim()) || /^\*{3,}$/.test(line.trim())) {
      i++;
      continue;
    }

    // Table line — skip (render as nothing for now)
    if (line.startsWith('|')) {
      while (i < lines.length && lines[i].startsWith('|')) i++;
      continue;
    }

    // Paragraph — collect until blank line
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('> ') &&
      !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith('|')
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: 'paragraph', text: paraLines.join(' ') });
    }
  }

  return blocks;
}

export function parseSectionFile(filePath: string): Section {
  const slug = basename(filePath, '.md');
  const raw = readFileSync(filePath, 'utf-8');
  const lines = raw.split('\n');

  let title = slug;
  let bodyStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const h1 = lines[i].match(/^#\s+(.+)$/);
    if (h1) {
      title = h1[1].trim();
      bodyStart = i + 1;
      break;
    }
    // skip Jekyll front matter
    if (lines[i].startsWith('---') && i === 0) {
      const end = lines.indexOf('---', 1);
      if (end > 0) bodyStart = end + 1;
      break;
    }
  }

  const body = lines.slice(bodyStart).join('\n').trim();
  const blocks = parseBlocks(body);
  const topics = tagTopics(title + ' ' + body, []);

  return { slug, title, body, blocks, topics };
}
