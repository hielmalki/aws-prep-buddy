import { readdirSync, writeFileSync, mkdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseExamFile } from './parseExam.js';
import { validateExams } from './validate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const NOTES_REPO = process.env.NOTES_REPO_PATH
  ?? resolve(__dirname, '../../../../aws/AWS-Certified-Cloud-Practitioner-Notes');

const EXAM_DIR = join(NOTES_REPO, 'practice-exam');
const IOS_RESOURCES_DIR = resolve(__dirname, '../../../myXcodeApp/myXcodeApp/Resources');

function main() {
  mkdirSync(IOS_RESOURCES_DIR, { recursive: true });

  const examFiles = readdirSync(EXAM_DIR)
    .filter(f => /^practice-exam-\d+\.md$/.test(f))
    .sort((a, b) => {
      const n = (f: string) => parseInt(f.match(/(\d+)/)![1], 10);
      return n(a) - n(b);
    });

  const exams = examFiles.map(f => parseExamFile(join(EXAM_DIR, f)));
  validateExams(exams);

  const totalQuestions = exams.reduce((sum, e) => sum + e.questions.length, 0);

  const outPath = join(IOS_RESOURCES_DIR, 'exams.json');
  writeFileSync(outPath, JSON.stringify(exams));

  const sizeKb = (statSync(outPath).size / 1024).toFixed(1);
  console.log(`exams: ${exams.length}, questions: ${totalQuestions}, size: ${sizeKb} KB -> ${outPath}`);
}

main();
