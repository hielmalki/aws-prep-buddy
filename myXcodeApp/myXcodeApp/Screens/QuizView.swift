import SwiftUI

struct QuizView: View {
    let exam: ContentExam
    let startFromFirst: Bool

    @StateObject private var quiz = QuizStore.shared
    @ObservedObject private var progress = ProgressStore.shared
    @State private var showTutor = false

    var body: some View {
        ZStack {
            AppColor.screen.ignoresSafeArea()
            Group {
                if quiz.isComplete {
                    ResultView(exam: exam)
                } else if let question = quiz.currentQuestion {
                    questionBody(question: question)
                } else {
                    ProgressView().tint(AppColor.accent)
                }
            }
        }
        .navigationBarBackButtonHidden(quiz.session != nil && !quiz.isComplete)
        .navigationTitle(quiz.session.map { "Exam \($0.examId ?? exam.examId)" } ?? "Quiz")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear { startQuiz() }
        .sheet(isPresented: $showTutor) {
            if let q = quiz.currentQuestion {
                TutorSheet(context: TutorContext(
                    examId: q.examId, questionNumber: q.number, questionText: q.text,
                    picked: quiz.submitted ? Array(quiz.selectedOptions) : nil,
                    correctLetters: quiz.submitted ? q.correctLetters : nil
                ))
            }
        }
    }

    @ViewBuilder
    private func questionBody(question: ContentQuestion) -> some View {
        let session = quiz.session!
        VStack(spacing: 0) {
            progressHeader(session: session)
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 16) {
                    topicsRow(question: question)
                    questionText(question: question)
                    optionsList(question: question)
                    if quiz.submitted { explanationPanel(question: question) }
                }
                .padding(AppSpacing.screenH)
                .padding(.bottom, 160)
            }
            aiHelpBar
            actionBar(question: question)
        }
    }

    private func progressHeader(session: QuizSession) -> some View {
        let pct = Double(session.currentIdx) / Double(max(1, session.questions.count))
        return VStack(spacing: 8) {
            AppProgressBar(value: pct, height: 4, color: AppColor.accent, trackColor: AppColor.surface3)
                .padding(.horizontal, AppSpacing.screenH)
            Text("Q\(session.currentIdx + 1) / \(session.questions.count)")
                .font(.appCaption)
                .foregroundStyle(AppColor.textMuted)
        }
        .padding(.vertical, 10)
        .background(AppColor.surface)
        .overlay(alignment: .bottom) {
            Rectangle().fill(AppColor.border).frame(height: 0.5)
        }
    }

    private func topicsRow(question: ContentQuestion) -> some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                ForEach(question.topics, id: \.self) { topic in
                    Text(topic)
                        .badgeText()
                        .foregroundStyle(AppColor.accent)
                        .padding(.horizontal, 8).padding(.vertical, 4)
                        .background(AppColor.accentSoft, in: Capsule())
                }
                if question.correctLetters.count > 1 {
                    Text("Multi-answer")
                        .badgeText()
                        .foregroundStyle(AppColor.warning)
                        .padding(.horizontal, 8).padding(.vertical, 4)
                        .background(AppColor.warningSoft, in: Capsule())
                }
            }
        }
    }

    private func questionText(question: ContentQuestion) -> some View {
        Text(question.text)
            .font(.appCardTitle)
            .foregroundStyle(AppColor.textPrimary)
            .fixedSize(horizontal: false, vertical: true)
    }

    private func optionsList(question: ContentQuestion) -> some View {
        VStack(spacing: 10) {
            ForEach(question.options, id: \.letter) { option in
                OptionRow(
                    option: option,
                    isSelected: quiz.selectedOptions.contains(option.letter),
                    isSubmitted: quiz.submitted,
                    isCorrect: question.correctLetters.contains(option.letter),
                    onTap: { quiz.toggleOption(option.letter, isMultiple: quiz.isMultipleAnswer) }
                )
            }
        }
    }

    private func explanationPanel(question: ContentQuestion) -> some View {
        let correct = gradeAnswer(question: question, picked: Array(quiz.selectedOptions))
        return CardContainer {
            VStack(alignment: .leading, spacing: 10) {
                HStack(spacing: 8) {
                    Image(systemName: correct ? "checkmark.circle.fill" : "xmark.circle.fill")
                        .foregroundStyle(correct ? AppColor.success : AppColor.danger)
                        .font(.system(size: 18))
                    Text(correct ? "Correct!" : "Incorrect")
                        .cardTitle()
                        .foregroundStyle(correct ? AppColor.success : AppColor.danger)
                }
                .padding(12)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(correct ? AppColor.successSoft : AppColor.dangerSoft, in: RoundedRectangle(cornerRadius: 10))

                Text("Correct answer: \(question.correctLetters.joined(separator: ", "))")
                    .captionText()
                    .foregroundStyle(AppColor.textMuted)
                if let explanation = question.explanation {
                    Text(explanation)
                        .font(.appBody)
                        .foregroundStyle(AppColor.textPrimary)
                }
            }
        }
    }

    private var aiHelpBar: some View {
        Button(action: { showTutor = true }) {
            HStack(spacing: 8) {
                Image(systemName: "sparkles")
                    .foregroundStyle(AppColor.accent)
                Text("AI Help")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(AppColor.accent)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 52)
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .strokeBorder(AppColor.border, lineWidth: 0.5)
            )
        }
        .padding(.horizontal, AppSpacing.screenH)
        .padding(.bottom, 8)
        .background(AppColor.surface)
    }

    private func actionBar(question: ContentQuestion) -> some View {
        let canSubmit = !quiz.selectedOptions.isEmpty
        return VStack(spacing: 0) {
            if !quiz.submitted {
                Button("Check Answer") { quiz.submit() }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(canSubmit ? .white : AppColor.textMuted)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(canSubmit ? AppColor.accent : AppColor.surface2,
                                in: RoundedRectangle(cornerRadius: 14))
                    .disabled(!canSubmit)
            } else {
                Button("Next Question") { quiz.advance() }
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 52)
                    .background(AppColor.accent, in: RoundedRectangle(cornerRadius: 14))
            }
        }
        .padding(.horizontal, AppSpacing.screenH)
        .padding(.vertical, 12)
        .background(AppColor.surface)
        .overlay(alignment: .top) {
            Rectangle().fill(AppColor.border).frame(height: 0.5)
        }
    }

    private func startQuiz() {
        guard quiz.session == nil || quiz.session?.examId != exam.examId else { return }
        let startQ = startFromFirst ? nil : progress.nextUnanswered(exam: exam)
        let startIdx = startQ.flatMap { q in exam.questions.firstIndex(where: { $0.number == q.number }) } ?? 0
        let questions = Array(exam.questions.dropFirst(startIdx))
        quiz.startSession(questions: questions, strategy: .sequential, examId: exam.examId)
    }
}

// MARK: - Option Row

struct OptionRow: View {
    let option: ContentOption
    let isSelected: Bool
    let isSubmitted: Bool
    let isCorrect: Bool
    let onTap: () -> Void

    var bgColor: Color {
        if !isSubmitted { return isSelected ? AppColor.accentSoft : AppColor.surface }
        if isCorrect { return AppColor.successSoft }
        if isSelected && !isCorrect { return AppColor.dangerSoft }
        return AppColor.surface
    }

    var borderColor: Color {
        if !isSubmitted { return isSelected ? AppColor.accent : AppColor.border }
        if isCorrect { return AppColor.success }
        if isSelected && !isCorrect { return AppColor.danger }
        return AppColor.border
    }

    var body: some View {
        Button(action: { if !isSubmitted { onTap() } }) {
            HStack(alignment: .top, spacing: 12) {
                ZStack {
                    Circle()
                        .fill(isSubmitted && isCorrect ? AppColor.success : (isSelected ? AppColor.accent : AppColor.surface3))
                        .frame(width: 32, height: 32)
                    Text(option.letter)
                        .font(.system(size: 13, weight: .bold))
                        .foregroundStyle(isSelected || (isSubmitted && isCorrect) ? .white : AppColor.textMuted)
                }
                Text(option.text)
                    .font(.appBody)
                    .foregroundStyle(AppColor.textPrimary)
                    .multilineTextAlignment(.leading)
                Spacer()
                if isSubmitted && isCorrect {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(AppColor.success)
                } else if isSubmitted && isSelected && !isCorrect {
                    Image(systemName: "xmark.circle.fill")
                        .foregroundStyle(AppColor.danger)
                }
            }
            .padding(14)
            .frame(maxWidth: .infinity)
            .background(bgColor, in: RoundedRectangle(cornerRadius: AppRadius.card))
            .overlay(RoundedRectangle(cornerRadius: AppRadius.card).strokeBorder(borderColor, lineWidth: 1))
        }
        .buttonStyle(.plain)
    }
}
