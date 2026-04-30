import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getOpenAIKey } from '@/lib/llm-keys';
import { TUTOR_SYSTEM_PROMPT } from './prompts';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface QuizContext {
  examId: number;
  questionNumber: number;
  questionText?: string;
  picked?: string[];
  correctLetters?: string[];
}

interface UserMemory {
  goals?: string;
  studyFocus?: string;
  personalNotes?: string;
}

interface WeakTopic {
  topic: string;
  pct: number;
  total: number;
}

interface TutorBody {
  messages: ChatMessage[];
  context?: QuizContext;
  conversationSummary?: string;
  userMemory?: UserMemory;
  weakTopics?: WeakTopic[];
}

const MAX_MESSAGES = 20;

function buildSystemPrompt(body: TutorBody): string {
  const blocks: string[] = [TUTOR_SYSTEM_PROMPT];

  const mem = body.userMemory;
  if (mem && (mem.goals || mem.studyFocus || mem.personalNotes)) {
    const lines: string[] = ['USER MEMORY:'];
    if (mem.goals) lines.push(`- Goals: ${mem.goals}`);
    if (mem.studyFocus) lines.push(`- Study focus: ${mem.studyFocus}`);
    if (mem.personalNotes) lines.push(`- Notes: ${mem.personalNotes}`);
    blocks.push(lines.join('\n'));
  }

  if (body.weakTopics && body.weakTopics.length > 0) {
    const lines = ['KNOWN WEAKNESSES (lowest accuracy first, from quiz history):'];
    for (const w of body.weakTopics.slice(0, 5)) {
      lines.push(`- ${w.topic}: ${w.pct}% over ${w.total} attempts`);
    }
    blocks.push(lines.join('\n'));
  }

  if (body.conversationSummary) {
    blocks.push(`EARLIER CONVERSATION SUMMARY:\n${body.conversationSummary}`);
  }

  if (body.context?.questionText) {
    const picked = body.context.picked?.join(', ') ?? '—';
    const correct = body.context.correctLetters?.join(', ') ?? '—';
    blocks.push(
      `CURRENT QUESTION CONTEXT:\nQuestion: ${body.context.questionText}\nUser selected: ${picked}\nCorrect answer(s): ${correct}`,
    );
  }

  return blocks.join('\n\n');
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function emit(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const body: TutorBody = await req.json();
        const { messages } = body;

        if (!Array.isArray(messages) || messages.length === 0) {
          emit({ error: 'messages must be a non-empty array' });
          controller.close();
          return;
        }

        const apiKey = req.headers.get('X-LLM-Key') || await getOpenAIKey();
        if (!apiKey) {
          emit({ error: 'No OpenAI API key configured. Set OPENAI_API_KEY or add it to llm-keys.json.' });
          controller.close();
          return;
        }

        const client = new OpenAI({ apiKey });

        const windowedMessages = messages.slice(-MAX_MESSAGES);
        const systemPrompt = buildSystemPrompt(body);

        const response = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          max_tokens: 512,
          stream: true,
          messages: [
            { role: 'system', content: systemPrompt },
            ...windowedMessages,
          ],
        });

        for await (const chunk of response) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            emit({ token: delta });
          }
        }

        emit({ done: true });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
          );
        } catch {
          // controller might already be closed
        }
      } finally {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
