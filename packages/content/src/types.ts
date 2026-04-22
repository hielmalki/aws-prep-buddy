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

export interface Section {
  slug: string;
  title: string;
  body: string;
  topics: string[];
}
