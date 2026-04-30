import SwiftUI

// MARK: - ResultView

struct ResultView: View {
    let exam: ContentExam
    @ObservedObject private var quiz = QuizStore.shared
    @ObservedObject private var progress = ProgressStore.shared
    @State private var generatingCards = false
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 0) {
                // Eyebrow
                Text("Exam \(exam.examId) · Result")
                    .font(.system(size: 11, weight: .bold))
                    .kerning(1)
                    .textCase(.uppercase)
                    .foregroundStyle(AppColor.textMuted)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.top, 24)

                // Trophy Hero
                VStack(spacing: 0) {
                    RoundedRectangle(cornerRadius: 18)
                        .fill(passed ? AppColor.successSoft : AppColor.accentSoft)
                        .frame(width: 72, height: 72)
                        .overlay(
                            Image(systemName: "trophy.fill")
                                .font(.system(size: 36))
                                .foregroundStyle(passed ? AppColor.success : AppColor.accent)
                        )
                        .padding(.top, 24)

                    Text("\(pct)%")
                        .heroNumber()
                        .foregroundStyle(AppColor.textPrimary)
                        .padding(.top, 16)

                    Text("\(correctCount) of \(totalCount) correct")
                        .font(.system(size: 14))
                        .foregroundStyle(AppColor.textMuted)
                        .padding(.top, 4)
                }
                .frame(maxWidth: .infinity)
                .padding(.bottom, 28)

                // Stat Chips
                HStack(spacing: 10) {
                    ResultStatChip(
                        value: correctCount,
                        label: "Correct",
                        valueColor: AppColor.success
                    )
                    ResultStatChip(
                        value: wrongCount,
                        label: "Wrong",
                        valueColor: AppColor.danger
                    )
                    ResultStatChip(
                        value: skippedCount,
                        label: "Skipped",
                        valueColor: AppColor.textPrimary
                    )
                }
                .padding(.bottom, 28)

                // Study topics section
                if !wrongQuestions.isEmpty {
                    SectionHeader(title: "Study these topics")
                        .padding(.bottom, 10)

                    VStack(spacing: 10) {
                        ForEach(groupedTopics, id: \.topic) { group in
                            TopicAccordionCard(
                                topic: group.topic,
                                questions: group.questions
                            )
                        }
                    }
                    .padding(.bottom, 20)

                    // Create Flashcards with AI button
                    Button(action: generateFlashcards) {
                        HStack(spacing: 8) {
                            Image(systemName: "sparkles")
                                .foregroundStyle(AppColor.accent)
                            Text(generatingCards ? "Generating…" : "Create Flashcards with AI")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundStyle(AppColor.accent)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(AppColor.accentSoft)
                        .clipShape(RoundedRectangle(cornerRadius: 14))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14)
                                .strokeBorder(
                                    AppColor.accent,
                                    style: StrokeStyle(lineWidth: 1.5, dash: [6, 4])
                                )
                        )
                    }
                    .disabled(generatingCards)
                    .padding(.bottom, 20)
                }

                // Action Buttons
                VStack(spacing: 10) {
                    // Review wrong
                    NavigationLink(
                        destination: ReviewView(
                            questions: wrongQuestions,
                            answers: progress.answers
                        )
                    ) {
                        Text("Review wrong (\(wrongCount))")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(wrongQuestions.isEmpty ? AppColor.textMuted : .white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .background(
                                wrongQuestions.isEmpty ? AppColor.surface2 : AppColor.accent,
                                in: RoundedRectangle(cornerRadius: 14)
                            )
                    }
                    .disabled(wrongQuestions.isEmpty)

                    // Back to home
                    Button(action: {
                        quiz.reset()
                        dismiss()
                    }) {
                        Text("Back to home")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(AppColor.textPrimary)
                            .frame(maxWidth: .infinity)
                            .frame(height: 52)
                            .background(AppColor.surface, in: RoundedRectangle(cornerRadius: 14))
                            .overlay(
                                RoundedRectangle(cornerRadius: 14)
                                    .strokeBorder(AppColor.border, lineWidth: 1)
                            )
                    }
                }
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 80)
        }
        .navigationTitle("")
        .navigationBarBackButtonHidden(true)
        .background(AppColor.screen.ignoresSafeArea())
    }

    // MARK: - Computed Properties

    private var score: (correct: Int, total: Int, pct: Double) {
        quiz.session?.score ?? (0, 0, 0)
    }

    private var correctCount: Int { score.correct }
    private var totalCount: Int { quiz.session?.questions.count ?? score.total }
    private var answeredCount: Int { score.total }
    private var pct: Int { Int(round(score.pct * 100)) }
    private var passed: Bool { score.pct >= 0.7 }

    private var wrongQuestions: [ContentQuestion] {
        guard let s = quiz.session else { return [] }
        return s.answers.filter { !$0.correct }.compactMap { entry in
            s.questions.first { $0.id == entry.questionId }
        }
    }

    private var wrongCount: Int { wrongQuestions.count }
    private var skippedCount: Int { totalCount - answeredCount }

    private var groupedTopics: [(topic: String, questions: [ContentQuestion])] {
        var dict: [String: [ContentQuestion]] = [:]
        for q in wrongQuestions {
            let key = q.topics.first ?? "General"
            dict[key, default: []].append(q)
        }
        return dict.keys.sorted().map { key in (topic: key, questions: dict[key]!) }
    }

    // MARK: - Actions

    private func generateFlashcards() {
        generatingCards = true
        let flashcards = FlashcardStore.shared
        _ = flashcards.ensureMistakesDeck()
        guard let session = quiz.session else { generatingCards = false; return }
        for q in wrongQuestions {
            if let entry = session.answers.first(where: { $0.questionId == q.id }) {
                flashcards.addMistakeCard(question: q, picked: entry.picked)
            }
        }
        generatingCards = false
    }
}

// MARK: - ResultStatChip

private struct ResultStatChip: View {
    let value: Int
    let label: String
    let valueColor: Color

    var body: some View {
        VStack(spacing: 4) {
            Text("\(value)")
                .font(.system(size: 18, weight: .bold))
                .foregroundStyle(valueColor)
            Text(label)
                .font(.system(size: 11, weight: .medium))
                .foregroundStyle(AppColor.textMuted)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 12)
        .background(AppColor.surface)
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .strokeBorder(AppColor.border, lineWidth: 1)
        )
    }
}

// MARK: - TopicAccordionCard

private struct TopicAccordionCard: View {
    let topic: String
    let questions: [ContentQuestion]
    @State private var expanded = false

    var body: some View {
        CardContainer {
            VStack(spacing: 0) {
                // Header row
                Button(action: { withAnimation(.easeInOut(duration: 0.2)) { expanded.toggle() } }) {
                    HStack(spacing: 12) {
                        // 40pt IconBadge with book glyph
                        ZStack {
                            RoundedRectangle(cornerRadius: AppRadius.iconBadge)
                                .fill(AppColor.accentSoft)
                                .frame(width: 40, height: 40)
                            Image(systemName: "book.fill")
                                .font(.system(size: 18, weight: .semibold))
                                .foregroundStyle(AppColor.accent)
                        }

                        VStack(alignment: .leading, spacing: 2) {
                            Text(topic)
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(AppColor.textPrimary)
                                .multilineTextAlignment(.leading)
                            Text("\(questions.count) wrong")
                                .font(.system(size: 12))
                                .foregroundStyle(AppColor.textMuted)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)

                        Image(systemName: "chevron.down")
                            .font(.system(size: 13))
                            .foregroundStyle(AppColor.textMuted)
                            .rotationEffect(.degrees(expanded ? 180 : 0))
                    }
                }
                .buttonStyle(.plain)

                // Expanded question list
                if expanded {
                    VStack(spacing: 0) {
                        Divider()
                            .background(AppColor.border)
                            .padding(.top, 10)

                        VStack(spacing: 0) {
                            ForEach(questions) { q in
                                HStack(alignment: .top, spacing: 8) {
                                    // Q# pill
                                    Text("Q\(q.number)")
                                        .font(.system(size: 10, weight: .heavy))
                                        .foregroundStyle(AppColor.accent)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 2)
                                        .background(AppColor.accentSoft, in: RoundedRectangle(cornerRadius: 6))
                                        .fixedSize()

                                    Text(q.text)
                                        .font(.system(size: 13))
                                        .foregroundStyle(AppColor.textPrimary)
                                        .lineLimit(2)
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                }
                                .padding(.vertical, 8)

                                if q.id != questions.last?.id {
                                    Divider()
                                        .background(AppColor.border)
                                }
                            }
                        }
                        .padding(.top, 4)
                    }
                }
            }
        }
    }
}
