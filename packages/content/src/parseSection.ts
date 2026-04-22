import { readFileSync } from 'fs';
import { basename } from 'path';
import type { Section } from './types.js';
import { tagTopics } from './tagTopics.js';

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
  const topics = tagTopics(title + ' ' + body, []);

  return { slug, title, body, topics };
}
