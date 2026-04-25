'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Question } from '@aws-prep/content';
import { gradeAnswer, nextUnansweredInExam, useProgressStore } from '@aws-prep/core';
import { theme, baseFont, mono, slate700, slate200 } from '@/lib/theme';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Chip } from '@/components/ui/Chip';
import { BottomNav } from '@/components/ui/BottomNav';
import { TutorSheet } from './TutorSheet';
import { Close, Sparkle, Chevron, ChevronDown, Check, X, Trophy } from '@/components/icons';

interface QuizScreenProps {
  question: Question;
  examId: number;
  questionNum: number;
  total: number;
  dark?: boolean;
}

export function QuizScreen({ question, examId, questionNum, total, dark = true }: QuizScreenProps) {
  const t = theme(dark);
  const router = useRouter();
  const recordAnswer = useProgressStore(s => s.recordAnswer);
  const answers = useProgressStore(s => s.answers);

  const [picked, setPicked] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [expOpen, setExpOpen] = useState(true);
  const [tutorOpen, setTutorOpen] = useState(false);

  const isMulti = question.correctLetters.length > 1;

  const togglePick = (letter: string) => {
    if (submitted) return;
    if (isMulti) {
      setPicked(prev => prev.includes(letter) ? prev.filter(l => l !== letter) : [...prev, letter]);
    } else {
      setPicked([letter]);
    }
  };

  const submit = () => {
    if (picked.length === 0) return;
    if (isMulti && picked.length !== question.correctLetters.length) return;
    setSubmitted(true);
    const isCorrect = gradeAnswer(question, picked);
    recordAnswer(examId, questionNum, picked, isCorrect);
  };

  const goNext = () => {
    const next = nextUnansweredInExam(answers, examId, total, questionNum + 1);
    if (next === null) {
      router.push(`/quiz/result?exam=${examId}`);
    } else {
      router.push(`/quiz?exam=${examId}&q=${next}`);
    }
  };

  return (
    <>
      <div style={{ background: t.bg, height: '100dvh', display: 'flex', flexDirection: 'column', fontFamily: baseFont, color: t.text, position: 'relative' }}>
        {/* top bar */}
        <div style={{ padding: '60px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/quiz')} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Close size={18} color={t.text}/>
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: t.textMuted, marginBottom: 6 }}>
              <span>Question {questionNum} of {total}</span>
              <span style={{ fontSize: 11 }}>Exam {examId}</span>
            </div>
            <ProgressBar pct={(questionNum / total) * 100} t={t}/>
          </div>
        </div>

        {/* content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '22px 20px 200px' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
            {question.topics.slice(0, 2).map(topic => (
              <Chip key={topic} color={t.accent} bg={t.accentSoft}>{topic}</Chip>
            ))}
            {isMulti && (
              <Chip color={t.textMuted} bg={dark ? 'rgba(255,255,255,0.04)' : '#F1F5F9'} border={t.border}>
                Multiple answers
              </Chip>
            )}
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.4, lineHeight: 1.35, margin: 0, color: t.text }}>
            {question.text}
          </h2>

          {/* options */}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {question.options.map(opt => {
              const isPicked = picked.includes(opt.letter);
              const isCorrect = submitted && question.correctLetters.includes(opt.letter);
              const isWrongPick = submitted && isPicked && !question.correctLetters.includes(opt.letter);
              let border = t.border, bg = t.surface, badgeBg = t.bg2, badgeColor = t.text;
              if (!submitted && isPicked) { border = t.accent; bg = t.accentSoft; badgeBg = t.accent; badgeColor = '#fff'; }
              if (isCorrect) { border = t.green; bg = dark ? 'rgba(74,222,128,0.1)' : '#F0FDF4'; badgeBg = t.green; badgeColor = '#fff'; }
              if (isWrongPick) { border = t.red; bg = dark ? 'rgba(248,113,113,0.1)' : '#FEF2F2'; badgeBg = t.red; badgeColor = '#fff'; }

              return (
                <button key={opt.letter}
                  disabled={submitted}
                  onClick={() => togglePick(opt.letter)}
                  style={{
                    textAlign: 'left', padding: 14, borderRadius: 14,
                    border: `1.5px solid ${border}`, background: bg, color: t.text,
                    cursor: submitted ? 'default' : 'pointer', fontFamily: baseFont,
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    transition: 'all .15s ease',
                  }}>
                  <div style={{ width: 32, height: 32, flexShrink: 0, borderRadius: 10, background: badgeBg, color: badgeColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                    {isCorrect ? <Check size={18} color="#fff"/> : isWrongPick ? <X size={18} color="#fff"/> : opt.letter}
                  </div>
                  <div style={{ flex: 1, fontSize: 14, fontWeight: 600, lineHeight: 1.4, paddingTop: 6 }}>
                    {opt.text}
                  </div>
                </button>
              );
            })}
          </div>

          {/* explanation panel */}
          {submitted && (
            <div style={{ marginTop: 16, borderRadius: 16, background: t.surface, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
              <button onClick={() => setExpOpen(!expOpen)} style={{ width: '100%', padding: 14, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', color: t.text, fontFamily: baseFont }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: t.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkle size={16} color={t.accent}/>
                </div>
                <div style={{ flex: 1, textAlign: 'left', fontSize: 14, fontWeight: 700 }}>
                  {gradeAnswer(question, picked) ? 'Correct!' : `Wrong — Answer: ${question.correctLetters.join(', ')}`}
                </div>
                <div style={{ transform: expOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform .2s' }}>
                  <ChevronDown size={18} color={t.textMuted}/>
                </div>
              </button>
              {expOpen && (
                <div style={{ padding: '0 14px 16px', fontSize: 13, color: t.textMuted, lineHeight: 1.6 }}>
                  {question.explanation ? (
                    <div style={{ padding: '10px 12px', borderRadius: 8, background: t.bg2, border: `1px solid ${t.border}`, fontFamily: mono, fontSize: 12, color: t.text, whiteSpace: 'pre-wrap' }}>
                      {question.explanation}
                    </div>
                  ) : (
                    <p style={{ margin: 0 }}>
                      The correct answer is <strong style={{ color: t.text }}>{question.correctLetters.join(' and ')}</strong>.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* floating AI button */}
        <button onClick={() => setTutorOpen(true)} style={{
          position: 'absolute', left: 20, right: 20, bottom: 88,
          height: 52, borderRadius: 16,
          border: `1px solid ${t.border}`,
          background: dark ? 'rgba(30,41,59,0.75)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          color: t.text, fontFamily: baseFont, fontSize: 14, fontWeight: 600,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)', zIndex: 30,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${t.accent} 0%, #FFB545 100%)` }}>
            <Sparkle size={16} color="#fff"/>
          </span>
          Ask AI about this question
        </button>

        {/* primary action */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 20px 24px', background: t.navBg, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: `1px solid ${t.border}`, zIndex: 35 }}>
          {!submitted ? (
            <button onClick={submit} disabled={picked.length === 0 || (isMulti && picked.length !== question.correctLetters.length)} style={{
              width: '100%', height: 52, borderRadius: 14, border: 'none',
              background: picked.length > 0 ? t.accent : (dark ? slate700 : slate200),
              color: picked.length > 0 ? '#fff' : t.textMuted, fontSize: 15, fontWeight: 700,
              fontFamily: baseFont, cursor: picked.length > 0 ? 'pointer' : 'not-allowed',
              transition: 'all .2s',
            }}>{isMulti ? `${picked.length}/${question.correctLetters.length} selected · Check` : 'Check answer'}</button>
          ) : (
            <button onClick={goNext} style={{ width: '100%', height: 52, borderRadius: 14, border: 'none', background: t.text, color: t.bg, fontSize: 15, fontWeight: 700, fontFamily: baseFont, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {nextUnansweredInExam(answers, examId, total, questionNum + 1) !== null ? <>Next question <Chevron size={18} color={t.bg}/></> : <>See results <Trophy size={18} color={t.bg}/></>}
            </button>
          )}
        </div>
      </div>
      <TutorSheet dark={dark} open={tutorOpen} onClose={() => setTutorOpen(false)}/>
    </>
  );
}
