import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getQuestion } from '@/lib/data';
import type { Question } from '@aws-prep/content';

export const runtime = 'nodejs';

interface GenerateBody {
  items: Array<{ examId: number; questionNumber: number }>;
  deckId: string;
  language?: 'de' | 'en';
}

const SYSTEM_PROMPT_DE = `Du erstellst kompakte Anki-Style-Lernkarten aus AWS Cloud Practitioner Quiz-Fragen, die der Lernende falsch beantwortet hat. WICHTIG — Copyright: Reformuliere das geprüfte Konzept als Front/Back-Lernkarte. Übernimm KEINE Frage- oder Antwort-Texte wörtlich. Front: kompakte Frage zum Konzept (max. 120 Zeichen). Back: präzise Antwort (max. 200 Zeichen, optional 1 Bullet). Kein Multiple-Choice-Format. Antwortsprache: Deutsch. Output strikt als JSONL — eine JSON-Zeile pro Karte: {"index": <n>, "front": "...", "back": "...", "tags": ["..."]}. Index startet bei 0 und entspricht der Reihenfolge in der Eingabeliste.`;

const SYSTEM_PROMPT_EN = `You create compact Anki-style flashcards from AWS Cloud Practitioner quiz questions that the learner answered incorrectly. IMPORTANT — Copyright: Rephrase the tested concept as a flashcard. Do NOT copy question or answer texts verbatim. Front: concise concept question (max 120 chars). Back: precise answer (max 200 chars, optional 1 bullet). No multiple-choice format. Output strictly as JSONL — one JSON line per card: {"index": <n>, "front": "...", "back": "...", "tags": ["..."]}. Index starts at 0 and matches the input list order.`;

function buildUserContent(questions: Question[]): string {
  return questions.map((q, i) => {
    const correctOptions = q.options
      .filter(o => q.correctLetters.includes(o.letter))
      .map(o => `${o.letter}) ${o.text}`)
      .join('; ');
    const lines = [
      `Question ${i} (examId=${q.examId}, #${q.number}):`,
      `Text: ${q.text}`,
      `Correct: ${correctOptions}`,
    ];
    if (q.explanation) lines.push(`Explanation: ${q.explanation}`);
    if (q.topics?.length) lines.push(`Topics: ${q.topics.join(', ')}`);
    return lines.join('\n');
  }).join('\n\n');
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      function emit(data: object) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      }

      try {
        const body: GenerateBody = await req.json();
        const { items, language = 'de' } = body;

        if (!Array.isArray(items) || items.length === 0) {
          emit({ error: 'items must be a non-empty array' });
          controller.close();
          return;
        }

        // Resolve questions
        const resolved: Question[] = [];
        for (const item of items) {
          const q = getQuestion(item.examId, item.questionNumber);
          if (q) resolved.push(q);
        }

        if (resolved.length === 0) {
          emit({ error: 'No questions could be resolved from the provided items' });
          controller.close();
          return;
        }

        // Resolve API key
        const apiKey =
          req.headers.get('X-LLM-Key') ?? process.env.ANTHROPIC_API_KEY ?? '';

        if (!apiKey) {
          emit({ error: 'No API key provided. Set ANTHROPIC_API_KEY or pass X-LLM-Key header.' });
          controller.close();
          return;
        }

        const client = new Anthropic({ apiKey });
        const model =
          process.env.ANTHROPIC_FLASHCARD_MODEL ?? 'claude-haiku-4-5-20251001';

        const systemPrompt = language === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_DE;
        const userContent = buildUserContent(resolved);

        // Stream with prompt caching
        const response = await client.messages.create({
          model,
          max_tokens: 2048,
          system: [
            {
              type: 'text',
              text: systemPrompt,
              cache_control: { type: 'ephemeral' },
            },
          ],
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: userContent,
                  cache_control: { type: 'ephemeral' },
                },
              ],
            },
          ],
          stream: true,
        });

        let buffer = '';

        for await (const event of response) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            buffer += event.delta.text;

            // Process complete lines
            const lines = buffer.split('\n');
            // Keep the last (potentially incomplete) chunk in the buffer
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed) continue;
              try {
                const parsed = JSON.parse(trimmed);
                emit(parsed);
              } catch {
                // Malformed line — skip silently
              }
            }
          }
        }

        // Flush remaining buffer
        if (buffer.trim()) {
          try {
            const parsed = JSON.parse(buffer.trim());
            emit(parsed);
          } catch {
            // ignore incomplete trailing line
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
