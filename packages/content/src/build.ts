import { readdirSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseExamFile } from './parseExam.js';
import { parseSectionFile } from './parseSection.js';
import { validateExams } from './validate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const NOTES_REPO = process.env.NOTES_REPO_PATH
  ?? resolve(__dirname, '../../../../aws/AWS-Certified-Cloud-Practitioner-Notes');

const EXAM_DIR    = join(NOTES_REPO, 'practice-exam');
const SECTION_DIR = join(NOTES_REPO, 'sections');
const DIST_DIR    = resolve(__dirname, '../dist');
const WEB_DATA_DIR = resolve(__dirname, '../../../apps/web/src/data');

function writeToAll(filename: string, content: string) {
  writeFileSync(join(DIST_DIR, filename), content);
  mkdirSync(WEB_DATA_DIR, { recursive: true });
  writeFileSync(join(WEB_DATA_DIR, filename), content);
}

function main() {
  mkdirSync(DIST_DIR, { recursive: true });

  // --- Exams ---
  const examFiles = readdirSync(EXAM_DIR)
    .filter(f => /^practice-exam-\d+\.md$/.test(f))
    .sort((a, b) => {
      const n = (f: string) => parseInt(f.match(/(\d+)/)![1], 10);
      return n(a) - n(b);
    });

  const exams = examFiles.map(f => parseExamFile(join(EXAM_DIR, f)));
  validateExams(exams);

  const allQuestions = exams.flatMap(e => e.questions);
  writeToAll('exams.json', JSON.stringify(allQuestions, null, 2));
  console.log(`✓ exams.json — ${exams.length} exams, ${allQuestions.length} questions`);

  // --- Sections ---
  const sectionFiles = readdirSync(SECTION_DIR).filter(f => f.endsWith('.md'));
  const sections = sectionFiles.map(f => parseSectionFile(join(SECTION_DIR, f)));
  writeToAll('sections.json', JSON.stringify(sections, null, 2));
  console.log(`✓ sections.json — ${sections.length} sections`);
}

main();
