import type { Question, Section } from '@aws-prep/content';
import rawQuestions from '@/data/exams.json';
import rawSections from '@/data/sections.json';

const allQuestions = rawQuestions as Question[];
const allSections = rawSections as Section[];

export function getQuestion(examId: number, questionNumber: number): Question | undefined {
  return allQuestions.find(q => q.examId === examId && q.number === questionNumber);
}

export function getExamQuestions(examId: number): Question[] {
  return allQuestions.filter(q => q.examId === examId);
}

export function getExamLength(examId: number): number {
  return getExamQuestions(examId).length;
}

export function getAllQuestions(): Question[] {
  return allQuestions;
}

export function getSections(): Section[] {
  return allSections;
}

export function getSection(slug: string): Section | undefined {
  return allSections.find(s => s.slug === slug);
}

export const EXAM_COUNT = 23;
