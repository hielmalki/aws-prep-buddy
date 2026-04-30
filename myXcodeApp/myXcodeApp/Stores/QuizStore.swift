import Foundation
import Combine

@MainActor
final class QuizStore: ObservableObject {
    static let shared = QuizStore()

    @Published var session: QuizSession?
    @Published var selectedOptions: Set<String> = []
    @Published var submitted = false
    @Published var showTutor = false

    private let progress = ProgressStore.shared
    private let flashcards = FlashcardStore.shared
    private let startTime = { Date() }

    private var questionStartTime: Date = Date()

    private init() {}

    func startSession(questions: [ContentQuestion], strategy: QuizStrategy, examId: Int? = nil) {
        session = createSession(questions: questions, strategy: strategy, examId: examId)
        selectedOptions = []
        submitted = false
        questionStartTime = Date()
    }

    func toggleOption(_ letter: String, isMultiple: Bool) {
        guard !submitted else { return }
        if isMultiple {
            if selectedOptions.contains(letter) {
                selectedOptions.remove(letter)
            } else {
                selectedOptions.insert(letter)
            }
        } else {
            selectedOptions = [letter]
        }
    }

    func submit() {
        guard var s = session, !submitted, !selectedOptions.isEmpty else { return }
        let timeMs = Int(Date().timeIntervalSince(questionStartTime) * 1000)
        let picked = Array(selectedOptions).sorted()
        submitAnswer(session: &s, picked: picked, timeMs: timeMs)
        session = s
        submitted = true

        if let q = s.questions[safe: s.currentIdx] {
            let correct = gradeAnswer(question: q, picked: picked)
            progress.recordAnswer(examId: q.examId, questionNumber: q.number, picked: picked, correct: correct)
            if !correct {
                flashcards.addMistakeCard(question: q, picked: picked)
            }
        }
    }

    func advance() {
        guard var s = session else { return }
        advanceSession(session: &s)
        session = s
        selectedOptions = []
        submitted = false
        questionStartTime = Date()
    }

    func reset() {
        session = nil
        selectedOptions = []
        submitted = false
    }

    var currentQuestion: ContentQuestion? { session?.currentQuestion }
    var isComplete: Bool { session?.isComplete ?? false }
    var isMultipleAnswer: Bool { (currentQuestion?.correctLetters.count ?? 1) > 1 }
}

extension Array {
    subscript(safe index: Index) -> Element? {
        indices.contains(index) ? self[index] : nil
    }
}
