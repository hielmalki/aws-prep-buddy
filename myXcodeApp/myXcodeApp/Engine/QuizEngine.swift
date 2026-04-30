import Foundation

enum QuizStrategy: String, Codable {
    case sequential, random, weakTopic = "weak-topic"
}

struct AnswerEntry: Codable {
    let questionId: String
    let picked: [String]
    let correct: Bool
    let timeMs: Int
}

struct QuizSession: Identifiable {
    let id: String
    let strategy: QuizStrategy
    let examId: Int?
    let questions: [ContentQuestion]
    var currentIdx: Int
    var answers: [AnswerEntry]
    let startedAt: Date
    var timePerQ: [Int]

    var currentQuestion: ContentQuestion? {
        guard currentIdx < questions.count else { return nil }
        return questions[currentIdx]
    }

    var isComplete: Bool { currentIdx >= questions.count }

    var score: (correct: Int, total: Int, pct: Double) {
        let correct = answers.filter { $0.correct }.count
        let total = answers.count
        let pct = total > 0 ? Double(correct) / Double(total) : 0
        return (correct, total, pct)
    }
}

func selectQuestions(
    all: [ContentQuestion],
    strategy: QuizStrategy,
    examId: Int? = nil,
    weakTopicIds: Set<String> = [],
    limit: Int? = nil
) -> [ContentQuestion] {
    var pool = examId != nil ? all.filter { $0.examId == examId } : all

    switch strategy {
    case .random:
        pool = pool.shuffled()
    case .weakTopic:
        if !weakTopicIds.isEmpty {
            pool = pool.filter { q in q.topics.contains(where: { weakTopicIds.contains($0) }) }
        }
        pool = pool.shuffled()
    case .sequential:
        break
    }

    if let limit = limit {
        pool = Array(pool.prefix(limit))
    }
    return pool
}

func gradeAnswer(question: ContentQuestion, picked: [String]) -> Bool {
    Set(picked) == Set(question.correctLetters)
}

func createSession(questions: [ContentQuestion], strategy: QuizStrategy, examId: Int? = nil) -> QuizSession {
    QuizSession(
        id: UUID().uuidString,
        strategy: strategy,
        examId: examId,
        questions: questions,
        currentIdx: 0,
        answers: [],
        startedAt: Date(),
        timePerQ: []
    )
}

func submitAnswer(session: inout QuizSession, picked: [String], timeMs: Int) {
    guard let q = session.currentQuestion else { return }
    let correct = gradeAnswer(question: q, picked: picked)
    let entry = AnswerEntry(questionId: q.id, picked: picked, correct: correct, timeMs: timeMs)
    session.answers.append(entry)
    session.timePerQ.append(timeMs)
}

func advanceSession(session: inout QuizSession) {
    session.currentIdx += 1
}
