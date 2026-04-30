import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getOpenAIKey } from '@/lib/llm-keys';
import { SUMMARIZER_PROMPT, MEMORY_EXTRACTION_PROMPT } from '../prompts';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface PreviousMemory {
  goals?: string;
  studyFocus?: string;
  personalNotes?: string;
}

interface SummarizeBody {
  mode: 'compress' | 'memory';
  messages: ChatMessage[];
  previousSummary?: string;
  previousMemory?: PreviousMemory;
}

function transcript(messages: ChatMessage[]): string {
  return messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
}

export async function POST(req: NextRequest) {
  let body: SummarizeBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.mode || !['compress', 'memory'].includes(body.mode)) {
    return NextResponse.json({ error: 'mode must be "compress" or "memory"' }, { status: 400 });
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: 'messages must be a non-empty array' }, { status: 400 });
  }

  const apiKey = req.headers.get('X-LLM-Key') || await getOpenAIKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: 'No OpenAI API key configured. Set OPENAI_API_KEY or add it to llm-keys.json.' },
      { status: 500 },
    );
  }

  const client = new OpenAI({ apiKey });

  if (body.mode === 'compress') {
    const userPayload = JSON.stringify({
      previousSummary: body.previousSummary ?? '',
      newMessages: transcript(body.messages),
    });
    try {
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 350,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: SUMMARIZER_PROMPT },
          { role: 'user', content: userPayload },
        ],
      });
      const raw = completion.choices[0]?.message?.content ?? '{}';
      const parsed = JSON.parse(raw) as { summary?: string };
      return NextResponse.json({ summary: (parsed.summary ?? '').trim() });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // mode === 'memory'
  const userPayload = JSON.stringify({
    previousMemory: body.previousMemory ?? { goals: '', studyFocus: '', personalNotes: '' },
    recentMessages: transcript(body.messages),
  });
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 350,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: MEMORY_EXTRACTION_PROMPT },
        { role: 'user', content: userPayload },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? '{}';
    const parsed = JSON.parse(raw) as PreviousMemory;
    return NextResponse.json({
      goals: (parsed.goals ?? '').slice(0, 200),
      studyFocus: (parsed.studyFocus ?? '').slice(0, 200),
      personalNotes: (parsed.personalNotes ?? '').slice(0, 200),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
