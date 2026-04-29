'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { theme, baseFont } from '@/lib/theme';
import { Sparkle, Close, Clip, Send } from '@/components/icons';
import {
  useTutorStore,
  useProgressStore,
  computeTopicAccuracy,
  weakestTopics,
  type TopicAccuracy,
} from '@aws-prep/core';
import { getQuestion } from '@/lib/data';

interface QuizContext {
  questionNumber: number;
  questionText?: string;
  topicLabel?: string;
  picked?: string[];
  correctLetters?: string[];
  examId?: number;
}

interface TutorSheetProps {
  dark: boolean;
  open: boolean;
  onClose: () => void;
  context?: QuizContext;
}

const QUICK_CHIPS = ['Explain simpler', 'Give an example', 'Why is this wrong?', 'Memory trick?'];

const TOPIC_LABELS: Record<string, string> = {
  EC2:        'Amazon EC2',
  S3:         'Amazon S3',
  IAM:        'Identity & Access Management',
  VPC:        'Virtual Private Cloud (VPC)',
  RDS:        'Amazon RDS',
  Lambda:     'AWS Lambda',
  CloudWatch: 'Amazon CloudWatch',
  Billing:    'Billing & Cost Management',
  Support:    'AWS Support Plans',
  Security:   'Security & Compliance',
  Networking: 'Networking & CDN',
  Compute:    'Compute in the Cloud',
  Storage:    'Storage Services',
  Databases:  'Database Services',
  Migration:  'Cloud Migration',
};

function renderMarkdown(raw: string): string {
  const esc = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const lines = esc.split('\n');
  const out: string[] = [];
  let inList = false;

  for (const line of lines) {
    const li = /^[-*] (.+)/.exec(line);
    if (li) {
      if (!inList) { out.push('<ul style="margin:4px 0;padding-left:16px;">'); inList = true; }
      out.push(`<li style="margin:2px 0">${applyInline(li[1])}</li>`);
    } else {
      if (inList) { out.push('</ul>'); inList = false; }
      if (line.trim() === '') {
        out.push('<div style="height:6px"></div>');
      } else {
        out.push(`<div>${applyInline(line)}</div>`);
      }
    }
  }
  if (inList) out.push('</ul>');
  return out.join('');
}

function applyInline(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

const WIRE_TURN_LIMIT = 16;        // last N messages sent verbatim
const COMPRESS_THRESHOLD = 24;     // start compressing when stored messages reach this
const COMPRESS_KEEP_TAIL = 8;      // keep this many recent messages after compression
const MEMORY_UPDATE_EVERY = 6;     // turns between memory refreshes

function topicLookup(examId: number, qNum: number): string[] {
  return getQuestion(examId, qNum)?.topics ?? [];
}

export function TutorSheet({ dark, open, onClose, context }: TutorSheetProps) {
  const t = theme(dark);

  const messages = useTutorStore(s => s.messages);
  const session = useTutorStore(s => s.session);
  const memory = useTutorStore(s => s.memory);
  const hydrated = useTutorStore(s => s.hydrated);

  const answers = useProgressStore(s => s.answers);
  const progressHydrated = useProgressStore(s => s.hydrated);

  const [streamingContent, setStreamingContent] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!useTutorStore.getState().hydrated) useTutorStore.getState().hydrate();
    if (!useProgressStore.getState().hydrated) useProgressStore.getState().hydrate();
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
      abortRef.current?.abort();
      setStreamingContent('');
      setStreaming(false);
      setInput('');
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const weakTopics = useMemo<TopicAccuracy[]>(() => {
    if (!progressHydrated) return [];
    return weakestTopics(computeTopicAccuracy(answers, topicLookup));
  }, [answers, progressHydrated]);

  async function maybeCompress() {
    const store = useTutorStore.getState();
    const all = store.messages;
    if (all.length < COMPRESS_THRESHOLD) return;
    const dropCount = all.length - COMPRESS_KEEP_TAIL;
    const toCompress = all.slice(0, dropCount);
    const lastIncludedSeq = toCompress[toCompress.length - 1].seq;
    try {
      const res = await fetch('/api/tutor/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'compress',
          messages: toCompress.map(m => ({ role: m.role, content: m.content })),
          previousSummary: store.session.summary,
        }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { summary?: string };
      if (data.summary) {
        await store.replaceHistoryWithSummary(data.summary, lastIncludedSeq);
      }
    } catch {
      // best-effort; skip
    }
  }

  async function maybeUpdateMemory() {
    const store = useTutorStore.getState();
    if (store.session.turnsSinceMemoryUpdate < MEMORY_UPDATE_EVERY) return;
    const recent = store.messages.slice(-12).map(m => ({ role: m.role, content: m.content }));
    if (recent.length === 0) return;
    try {
      const res = await fetch('/api/tutor/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'memory',
          messages: recent,
          previousMemory: {
            goals: store.memory.goals,
            studyFocus: store.memory.studyFocus,
            personalNotes: store.memory.personalNotes,
          },
        }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { goals?: string; studyFocus?: string; personalNotes?: string };
      await store.setMemory({
        goals: data.goals ?? store.memory.goals,
        studyFocus: data.studyFocus ?? store.memory.studyFocus,
        personalNotes: data.personalNotes ?? store.memory.personalNotes,
      });
      await store.resetTurnsSinceMemoryUpdate();
    } catch {
      // best-effort
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || streaming || !hydrated) return;
    setInput('');

    const store = useTutorStore.getState();
    await store.appendMessage('user', text.trim());

    const all = useTutorStore.getState().messages;
    const wireMsgs = all
      .slice(-WIRE_TURN_LIMIT)
      .map(m => ({ role: m.role, content: m.content }));

    setStreaming(true);
    setStreamingContent('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          messages: wireMsgs,
          context: context ? {
            examId: context.examId,
            questionNumber: context.questionNumber,
            questionText: context.questionText,
            picked: context.picked,
            correctLetters: context.correctLetters,
          } : undefined,
          conversationSummary: store.session.summary || undefined,
          userMemory: (store.memory.goals || store.memory.studyFocus || store.memory.personalNotes) ? {
            goals: store.memory.goals,
            studyFocus: store.memory.studyFocus,
            personalNotes: store.memory.personalNotes,
          } : undefined,
          weakTopics: weakTopics.map(w => ({ topic: TOPIC_LABELS[w.topic] ?? w.topic, pct: w.pct, total: w.total })),
        }),
      });

      if (!res.ok || !res.body) {
        await store.appendMessage('assistant', 'Error: could not reach the tutor.');
        return;
      }

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let accumulated = '';

      outer: while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = dec.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.error) {
              await store.appendMessage('assistant', `Error: ${payload.error}`);
              setStreamingContent('');
              setStreaming(false);
              return;
            }
            if (payload.done) {
              await store.appendMessage('assistant', accumulated);
              setStreamingContent('');
              setStreaming(false);
              break outer;
            }
            if (payload.token) {
              accumulated += payload.token;
              setStreamingContent(accumulated);
            }
          } catch {
            // malformed line — skip
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        await useTutorStore.getState().appendMessage('assistant', 'Connection lost. Please try again.');
      }
    } finally {
      setStreaming(false);
      setStreamingContent('');
    }

    // Post-turn housekeeping (best-effort, non-blocking for UX)
    try {
      await useTutorStore.getState().bumpTurnsSinceMemoryUpdate();
      await maybeUpdateMemory();
      await maybeCompress();
    } catch {
      // ignore
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  async function handleReset() {
    if (typeof window !== 'undefined' && !window.confirm('Reset tutor history and memory?')) return;
    abortRef.current?.abort();
    setStreamingContent('');
    setStreaming(false);
    await useTutorStore.getState().clearAll();
  }

  if (!open) return null;

  const allDisplayed = streamingContent
    ? [...messages, { role: 'assistant' as const, content: streamingContent, seq: -1 }]
    : messages;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 80, pointerEvents: 'auto' }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: dark ? 'rgba(2,6,15,0.55)' : 'rgba(15,23,42,0.35)',
        backdropFilter: 'blur(4px)',
        opacity: mounted ? 1 : 0, transition: 'opacity .25s',
      }}/>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '88%',
        background: dark ? 'rgba(15,23,42,0.92)' : 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        border: `1px solid ${t.border}`, borderBottom: 'none',
        borderRadius: '24px 24px 0 0',
        color: t.text, fontFamily: baseFont,
        display: 'flex', flexDirection: 'column',
        transform: mounted ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform .35s cubic-bezier(.2,.8,.2,1)',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: t.borderStrong }}/>
        </div>

        <div style={{ padding: '6px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkle size={18} color={t.accentText}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>AI Tutor</div>
            <div style={{ fontSize: 11, color: t.textMuted }}>
              GPT-4o-mini · AWS Practitioner
              {memory.goals || memory.studyFocus || memory.personalNotes ? ' · remembers you' : ''}
            </div>
          </div>
          <button
            onClick={handleReset}
            title="Reset chat & memory"
            style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: t.bg2, color: t.textMuted, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >↺</button>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: t.bg2, color: t.text, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Close size={16} color={t.text}/>
          </button>
        </div>

        {context && (
          <div style={{ padding: '0 16px 10px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 10px 7px 8px', borderRadius: 10,
              background: t.accentSoft, border: `1px solid ${t.border}`,
              fontSize: 12, color: t.text, fontWeight: 500,
            }}>
              <Clip size={13} color={t.accent}/>
              <span style={{ fontWeight: 600 }}>Question {context.questionNumber}</span>
              {context.topicLabel && <>
                <span style={{ color: t.textMuted }}>·</span>
                <span style={{ color: t.textMuted }}>{context.topicLabel}</span>
              </>}
            </div>
          </div>
        )}

        {session.summary && (
          <div style={{ padding: '0 16px 8px' }}>
            <div style={{ fontSize: 10, color: t.textMuted, fontStyle: 'italic' }}>
              Earlier in this conversation has been summarized to keep context lean.
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {allDisplayed.length === 0 && (
            <div style={{ textAlign: 'center', color: t.textMuted, fontSize: 13, marginTop: 24 }}>
              Ask anything about AWS Cloud Practitioner
            </div>
          )}
          {allDisplayed.map((m, i) => (
            <div key={`${('seq' in m ? m.seq : i)}-${i}`} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%', padding: '10px 13px', borderRadius: 16,
                background: m.role === 'user' ? t.accent : (dark ? 'rgba(30,41,59,0.7)' : '#fff'),
                color: m.role === 'user' ? '#fff' : t.text,
                fontSize: 13, lineHeight: 1.5,
                border: m.role === 'user' ? 'none' : `1px solid ${t.border}`,
                borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                borderBottomLeftRadius: m.role === 'user' ? 16 : 4,
                wordBreak: 'break-word',
              }}>
                {m.role === 'user' ? (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{m.content}</span>
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }}/>
                )}
                {streaming && i === allDisplayed.length - 1 && m.role === 'assistant' && (
                  <span style={{ display: 'inline-block', width: 2, height: 14, background: t.accent, marginLeft: 2, verticalAlign: 'middle', animation: 'blink 1s step-end infinite' }}/>
                )}
              </div>
            </div>
          ))}
          {streaming && streamingContent === '' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: t.textMuted, fontSize: 11, padding: '2px 4px' }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 5, height: 5, borderRadius: 3, background: t.textMuted, display: 'inline-block',
                    animation: `dot 1.2s ${i * 0.15}s infinite`,
                  }}/>
                ))}
              </div>
              typing…
            </div>
          )}
          <div ref={bottomRef}/>
        </div>

        {messages.length === 0 && (
          <div style={{ padding: '0 16px 10px', display: 'flex', gap: 6, overflowX: 'auto' }}>
            {QUICK_CHIPS.map(c => (
              <button key={c} onClick={() => sendMessage(c)} style={{
                padding: '7px 12px', borderRadius: 999,
                background: t.bg2, border: `1px solid ${t.border}`,
                color: t.text, fontSize: 12, fontWeight: 500,
                fontFamily: baseFont, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>{c}</button>
            ))}
          </div>
        )}

        <div style={{ padding: '10px 16px 24px', borderTop: `1px solid ${t.border}`, display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', height: 44, borderRadius: 12, background: t.bg2, border: `1px solid ${t.border}` }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about AWS…"
              disabled={streaming}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: baseFont, fontSize: 14, color: t.text }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || streaming}
            style={{
              width: 44, height: 44, borderRadius: 12, border: 'none',
              background: input.trim() && !streaming ? t.accent : t.bg2,
              color: input.trim() && !streaming ? '#fff' : t.textMuted,
              cursor: input.trim() && !streaming ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all .15s',
            }}>
            <Send size={18} color={input.trim() && !streaming ? '#fff' : t.textMuted}/>
          </button>
        </div>
      </div>
    </div>
  );
}
