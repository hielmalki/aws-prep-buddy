import type { Exam } from './types.js';

export function validateExams(exams: Exam[]): void {
  const errors: string[] = [];

  if (exams.length !== 23) {
    const found = new Set(exams.map(e => e.examId));
    const missing: number[] = [];
    for (let i = 1; i <= 23; i++) if (!found.has(i)) missing.push(i);
    errors.push(`Expected 23 exams, got ${exams.length}. Missing IDs: ${missing.join(', ')}`);
  }

  const seen = new Set<string>();
  for (const exam of exams) {
    for (const q of exam.questions) {
      const key = `${exam.examId}:${q.number}`;
      if (seen.has(key)) errors.push(`Duplicate question ${key}`);
      seen.add(key);

      if (q.options.length < 2)
        errors.push(`Exam ${exam.examId} Q${q.number}: fewer than 2 options (got ${q.options.length})`);

      if (q.correctLetters.length < 1)
        errors.push(`Exam ${exam.examId} Q${q.number}: no correct letter`);

      const optionLetters = new Set(q.options.map(o => o.letter));
      for (const cl of q.correctLetters) {
        if (!optionLetters.has(cl))
          errors.push(`Exam ${exam.examId} Q${q.number}: correct letter "${cl}" not in options`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`);
  }
}
