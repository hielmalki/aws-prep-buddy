import SwiftUI

struct ResultView: View {
    let exam: ContentExam
    @ObservedObject private var quiz = QuizStore.shared
    @ObservedObject private var flashcards = FlashcardStore.shared
    @State private var showTutor = false
    @State private var generatingCards = false
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                scoreHero
                statChips
                if !wrongQuestions.isEmpty {
                    wrongQuestionsSection
                }
                actionButtons
            }
            .padding()
            .padding(.bottom, 80)
        }
        .navigationTitle("Result")
        .navigationBarBackButtonHidden(true)
        .sheet(isPresented: $showTutor) {
            TutorSheet(context: TutorContext())
        }
    }

    private var score: (correct: Int, total: Int, pct: Double) {
        quiz.session?.score ?? (0, 0, 0)
    }

    private var wrongQuestions: [ContentQuestion] {
        guard let s = quiz.session else { return [] }
        return s.answers.filter { !$0.correct }.compactMap { entry in
            s.questions.first { $0.id == entry.questionId }
        }
    }

    private var scoreHero: some View {
        let s = score
        let passed = s.pct >= 0.7
        return VStack(spacing: 12) {
            ZStack {
                Circle()
                    .strokeBorder(passed ? Color.green : Color.red, lineWidth: 6)
                    .frame(width: 120, height: 120)
                VStack(spacing: 2) {
                    Text(String(format: "%.0f%%", s.pct * 100))
                        .font(.system(size: 38, weight: .bold))
                    Image(systemName: passed ? "checkmark" : "xmark")
                        .font(.title2)
                        .foregroundStyle(passed ? .green : .red)
                }
            }
            Text(passed ? "Passed!" : "Keep Studying")
                .font(.title2.bold())
                .foregroundStyle(passed ? .green : .red)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 20)
    }

    private var statChips: some View {
        let s = score
        return HStack(spacing: 12) {
            StatChip(label: "Correct", value: "\(s.correct)", color: .green)
            StatChip(label: "Wrong", value: "\(s.total - s.correct)", color: .red)
            StatChip(label: "Total", value: "\(s.total)", color: .accentColor)
        }
    }

    private var wrongQuestionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Review Wrong Answers")
                .font(.headline)
            ForEach(wrongQuestions) { q in
                WrongQuestionCard(question: q)
            }
        }
    }

    private var actionButtons: some View {
        VStack(spacing: 12) {
            Button(action: { showTutor = true }) {
                Label("Ask AI Tutor", systemImage: "sparkles")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(.purple)

            Button(action: generateFlashcards) {
                Label(generatingCards ? "Generating…" : "Create AI Flashcards", systemImage: "rectangle.stack")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
            .disabled(generatingCards || wrongQuestions.isEmpty)

            Button(action: {
                quiz.reset()
                dismiss()
            }) {
                Text("Back to Exams")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
        }
    }

    private func generateFlashcards() {
        generatingCards = true
        let deck = flashcards.ensureMistakesDeck()
        for q in wrongQuestions {
            if let entry = quiz.session?.answers.first(where: { $0.questionId == q.id }) {
                flashcards.addMistakeCard(question: q, picked: entry.picked)
            }
        }
        generatingCards = false
    }
}

struct StatChip: View {
    let label: String
    let value: String
    let color: Color

    var body: some View {
        VStack(spacing: 4) {
            Text(value).font(.title2.bold()).foregroundStyle(color)
            Text(label).font(.caption).foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(color.opacity(0.08), in: RoundedRectangle(cornerRadius: 12))
    }
}

struct WrongQuestionCard: View {
    let question: ContentQuestion

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(question.text)
                .font(.subheadline)
                .lineLimit(3)
            HStack {
                Label(question.correctLetters.joined(separator: ", "), systemImage: "checkmark.circle.fill")
                    .font(.caption)
                    .foregroundStyle(.green)
            }
        }
        .padding(12)
        .background(.background.secondary, in: RoundedRectangle(cornerRadius: 10))
    }
}
