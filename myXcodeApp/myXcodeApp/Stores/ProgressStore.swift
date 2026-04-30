import Foundation
import Combine

@MainActor
final class ProgressStore: ObservableObject {
    static let shared = ProgressStore()
    private let storage = StorageService.shared
    private let table = "answers"

    @Published private(set) var answers: [String: AnswerRecord] = [:]

    private init() { load() }

    private func load() {
        let all = storage.list(AnswerRecord.self, table: table)
        answers = Dictionary(uniqueKeysWithValues: all.map { r in
            ("\(r.examId):\(r.questionNumber)", r)
        })
    }

    func recordAnswer(examId: Int, questionNumber: Int, picked: [String], correct: Bool) {
        let key = "\(examId):\(questionNumber)"
        let record = AnswerRecord(
            examId: examId,
            questionNumber: questionNumber,
            picked: picked,
            correct: correct,
            updatedAt: Date()
        )
        answers[key] = record
        storage.put(record, table: table, key: key)
        StreakStore.shared.recordActivity()
    }

    func examProgress(exam: ContentExam) -> ExamProgress {
        let answered = exam.questions.filter { answers["\($0.examId):\($0.number)"] != nil }
        let correct = answered.filter { answers["\($0.examId):\($0.number)"]?.correct == true }
        return ExamProgress(examId: exam.examId, answered: answered.count, total: exam.questions.count, correct: correct.count)
    }

    func nextUnanswered(exam: ContentExam) -> ContentQuestion? {
        exam.questions.first { answers["\($0.examId):\($0.number)"] == nil }
    }

    func wrongQuestions(exam: ContentExam) -> [ContentQuestion] {
        exam.questions.filter { q in
            if let r = answers["\(q.examId):\(q.number)"] { return !r.correct }
            return false
        }
    }

    func answeredRecord(examId: Int, questionNumber: Int) -> AnswerRecord? {
        answers["\(examId):\(questionNumber)"]
    }

    var stats: ProgressStats {
        let allAnswers = Array(answers.values)
        let correct = allAnswers.filter { $0.correct }.count
        let total = allAnswers.count
        let today = todayString()
        let todayCount = allAnswers.filter { dateString($0.updatedAt) == today }.count
        let streak = StreakStore.shared
        return ProgressStats(
            totalAnswered: total,
            todayAnswered: todayCount,
            correctCount: correct,
            avgScore: total > 0 ? Double(correct) / Double(total) : 0,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak
        )
    }

    func topicAccuracy() -> [String: (correct: Int, total: Int)] {
        var result: [String: (correct: Int, total: Int)] = [:]
        // We'd need question data here; computed in QuizStore instead
        return result
    }

    private func todayString() -> String { dateString(Date()) }
    private func dateString(_ date: Date) -> String {
        let f = DateFormatter(); f.dateFormat = "yyyy-MM-dd"; return f.string(from: date)
    }
}
