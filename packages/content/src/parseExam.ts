import { readFileSync } from 'fs';
import { basename } from 'path';
import type { Exam, Question, Option } from './types.js';
import { tagTopics } from './tagTopics.js';

interface State {
  inQuestion: boolean;
  inDetails: boolean;
  number: number;
  text: string;
  options: Option[];
  detailsLines: string[];
}

function freshState(): State {
  return { inQuestion: false, inDetails: false, number: 0, text: '', options: [], detailsLines: [] };
}

function parseCorrectLetters(raw: string): string[] {
  const cleaned = raw.trim().toUpperCase().replace(/\s+/g, '');
  if (cleaned.includes(',')) {
    return cleaned.split(',').map(l => l.trim()).filter(Boolean);
  }
  // handles both single "D" and concatenated "BE", "ACD"
  return cleaned.split('').filter(c => /[A-E]/.test(c));
}

function finalizeQuestion(state: State, examId: number, autoNumber: number): Question | null {
  if (!state.text) return null;

  const detailsText = state.detailsLines.join('\n');
  const answerMatch = detailsText.match(/Correct Answer:\s*([A-E, ]+)/i);
  if (!answerMatch) return null;

  const correctLetters = parseCorrectLetters(answerMatch[1]);

  let explanation: string | undefined;
  const explMatch = detailsText.match(/Explanation:\s*\n([\s\S]+?)(?:<\/details>|$)/i);
  if (explMatch) {
    explanation = explMatch[1]
      .split('\n')
      .map(l => l.replace(/^\s{0,6}/, ''))
      .join('\n')
      .trim() || undefined;
  }

  return {
    examId,
    number: autoNumber,
    text: state.text.trim(),
    options: state.options,
    correctLetters,
    ...(explanation ? { explanation } : {}),
    topics: tagTopics(state.text, state.options),
  };
}

export function parseExamFile(filePath: string): Exam {
  const fileName = basename(filePath);
  const idMatch = fileName.match(/practice-exam-(\d+)\.md$/);
  if (!idMatch) throw new Error(`Unexpected filename: ${fileName}`);
  const examId = parseInt(idMatch[1], 10);

  const lines = readFileSync(filePath, 'utf-8').split('\n');
  const questions: Question[] = [];
  let state = freshState();
  let autoNumber = 0;

  for (const line of lines) {
    const questionStart = line.match(/^(\d+)\.\s+(.+)$/);
    if (questionStart) {
      if (state.text) {
        autoNumber += 1;
        const q = finalizeQuestion(state, examId, autoNumber);
        if (q) questions.push(q);
      }
      state = freshState();
      state.inQuestion = true;
      state.number = parseInt(questionStart[1], 10);
      state.text = questionStart[2];
      continue;
    }

    if (state.inQuestion && /<details/.test(line)) {
      state.inQuestion = false;
      state.inDetails = true;
      state.detailsLines.push(line);
      continue;
    }

    if (state.inDetails && /<\/details>/.test(line)) {
      state.detailsLines.push(line);
      state.inDetails = false;
      continue;
    }

    if (state.inDetails) {
      state.detailsLines.push(line);
      continue;
    }

    if (state.inQuestion) {
      const optMatch = line.match(/^\s*-\s+([A-E])\.\s+(.+)$/);
      if (optMatch) {
        state.options.push({ letter: optMatch[1], text: optMatch[2].trim() });
      }
    }
  }

  // finalize last question
  if (state.text) {
    autoNumber += 1;
    const q = finalizeQuestion(state, examId, autoNumber);
    if (q) questions.push(q);
  }

  return { examId, questions };
}
