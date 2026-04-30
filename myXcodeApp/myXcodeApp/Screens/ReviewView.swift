import SwiftUI

struct ReviewView: View {
    let questions: [ContentQuestion]
    let answers: [String: AnswerRecord]
    @State private var currentIndex = 0
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        Group {
            if questions.isEmpty {
                ContentUnavailableView("No wrong answers", systemImage: "checkmark.circle")
            } else if currentIndex < questions.count {
                reviewBody(question: questions[currentIndex])
            } else {
                doneBanner
            }
        }
        .navigationTitle("Review")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func reviewBody(question: ContentQuestion) -> some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("Q\(currentIndex + 1) / \(questions.count)")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Text(question.text)
                    .font(.body)

                VStack(spacing: 10) {
                    ForEach(question.options, id: \.letter) { option in
                        let record = answers["\(question.examId):\(question.number)"]
                        let picked = record?.picked ?? []
                        let isCorrect = question.correctLetters.contains(option.letter)
                        let wasPicked = picked.contains(option.letter)
                        HStack(alignment: .top, spacing: 12) {
                            Image(systemName: isCorrect ? "checkmark.circle.fill" : (wasPicked ? "xmark.circle.fill" : "circle"))
                                .foregroundStyle(isCorrect ? .green : (wasPicked ? .red : .secondary))
                            Text("\(option.letter). \(option.text)")
                                .font(.body)
                        }
                        .padding(12)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(
                            isCorrect ? Color.green.opacity(0.1) : (wasPicked ? Color.red.opacity(0.1) : Color(.secondarySystemBackground)),
                            in: RoundedRectangle(cornerRadius: 10)
                        )
                    }
                }

                if let explanation = question.explanation {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Explanation").font(.headline)
                        Text(explanation).font(.body)
                    }
                    .padding()
                    .background(.background.secondary, in: RoundedRectangle(cornerRadius: 12))
                }

                Button("Next") { currentIndex += 1 }
                    .buttonStyle(.borderedProminent)
                    .frame(maxWidth: .infinity)
            }
            .padding()
            .padding(.bottom, 80)
        }
    }

    private var doneBanner: some View {
        VStack(spacing: 20) {
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 60))
                .foregroundStyle(.green)
            Text("Review Complete")
                .font(.title2.bold())
            Button("Done") { dismiss() }
                .buttonStyle(.borderedProminent)
        }
    }
}
