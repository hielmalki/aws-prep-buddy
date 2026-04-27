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

interface TutorBody {
  messages: ChatMessage[];
  context?: QuizContext;
}

const MAX_MESSAGES = 20;

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function emit(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const body: TutorBody = await req.json();
        const { messages, context } = body;

        if (!Array.isArray(messages) || messages.length === 0) {
          emit({ error: 'messages must be a non-empty array' });
          controller.close();
          return;
        }

        const apiKey = await getOpenAIKey();
        if (!apiKey) {
          emit({ error: 'No OpenAI API key configured. Set OPENAI_API_KEY or add it to llm-keys.json.' });
          controller.close();
          return;
        }

        const client = new OpenAI({ apiKey });

        // Apply sliding window
        const windowedMessages = messages.slice(-MAX_MESSAGES);

        // Build context injection if quiz question is provided
        let systemPrompt = TUTOR_SYSTEM_PROMPT;
        if (context?.questionText) {
          const picked = context.picked?.join(', ') ?? '—';
          const correct = context.correctLetters?.join(', ') ?? '—';
          systemPrompt += `\n\nCURRENT QUESTION CONTEXT:\nQuestion: ${context.questionText}\nUser selected: ${picked}\nCorrect answer(s): ${correct}`;
        }

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
