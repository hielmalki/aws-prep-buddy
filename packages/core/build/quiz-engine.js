export function selectQuestions(all, strategy, options = {}) {
    const { examId, n, weakTopics = [] } = options;
    let pool;
    switch (strategy) {
        case 'sequential':
            pool = examId !== undefined ? all.filter(q => q.examId === examId) : all;
            break;
        case 'random':
            pool = [...all].sort(() => Math.random() - 0.5);
            break;
        case 'weak-topic': {
            const filtered = weakTopics.length > 0
                ? all.filter(q => q.topics.some(t => weakTopics.includes(t)))
                : [];
            pool = filtered.length > 0
                ? filtered.sort(() => Math.random() - 0.5)
                : [...all].sort(() => Math.random() - 0.5);
            break;
        }
    }
    return n !== undefined ? pool.slice(0, n) : pool;
}
export function gradeAnswer(question, picked) {
    if (picked.length === 0)
        return false;
    const correct = new Set(question.correctLetters);
    const chosen = new Set(picked);
    if (correct.size !== chosen.size)
        return false;
    for (const c of correct)
        if (!chosen.has(c))
            return false;
    return true;
}
export function createSession(questions, strategy, examId) {
    return {
        id: globalThis.crypto.randomUUID(),
        strategy,
        examId,
        questions,
        currentIdx: 0,
        answers: [],
        startedAt: Date.now(),
        timePerQ: [],
    };
}
export function submitAnswer(session, picked, timeMs) {
    const q = session.questions[session.currentIdx];
    if (!q)
        return session;
    const entry = {
        examId: q.examId,
        questionNumber: q.number,
        picked,
        correct: gradeAnswer(q, picked),
        timeMs,
    };
    return {
        ...session,
        answers: [...session.answers, entry],
        timePerQ: [...session.timePerQ, timeMs],
    };
}
export function nextQuestion(session) {
    return { ...session, currentIdx: session.currentIdx + 1 };
}
export function isSessionComplete(session) {
    return session.currentIdx >= session.questions.length;
}
export function getSessionScore(session) {
    const correct = session.answers.filter(a => a.correct).length;
    const total = session.answers.length;
    return { correct, total, pct: total > 0 ? Math.round((correct / total) * 100) : 0 };
}
//# sourceMappingURL=quiz-engine.js.map