export interface Option {
  letter: string;
  text: string;
}

export interface Question {
  examId: number;
  number: number;
  text: string;
  options: Option[];
  correctLetters: string[];
  explanation?: string;
  topics: string[];
}

export interface Exam {
  examId: number;
  questions: Question[];
}

export type SectionBlock =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language?: string; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'blockquote'; text: string };

export interface Section {
  slug: string;
  title: string;
  body: string;
  blocks: SectionBlock[];
  topics: string[];
}
