import { readFile } from 'fs/promises';
import path from 'path';

let cached: string | null = null;

export async function getOpenAIKey(): Promise<string> {
  if (cached !== null) return cached;

  try {
    const filePath = path.join(process.cwd(), 'llm-keys.json');
    const raw = await readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw) as { openai?: string };
    if (parsed.openai) {
      cached = parsed.openai;
      return cached;
    }
  } catch {
    // file missing or unreadable — fall through to env
  }

  const envKey = process.env.OPENAI_API_KEY ?? '';
  cached = envKey;
  return cached;
}
