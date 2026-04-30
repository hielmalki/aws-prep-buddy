import SwiftUI

struct ExamListView: View {
    @ObservedObject private var content = ContentRepository.shared
    @ObservedObject private var progress = ProgressStore.shared

    var body: some View {
        ZStack {
            AppColor.screen.ignoresSafeArea()
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: AppSpacing.gap) {
                    ScreenHeader(
                        eyebrow: "Practice",
                        title: "Exams",
                        subtitle: "\(content.exams.count) exams available",
                        subtitleColor: AppColor.accent
                    )
                    .padding(.horizontal, 0)

                    VStack(spacing: AppSpacing.gap) {
                        ForEach(content.exams) { exam in
                            let ep = progress.examProgress(exam: exam)
                            NavigationLink(destination: QuizView(exam: exam, startFromFirst: false)) {
                                CardContainer {
                                    HStack(spacing: AppSpacing.gap) {
                                        IconBadge(systemName: "doc.text.fill", color: AppColor.accent, size: 48)
                                        VStack(alignment: .leading, spacing: 6) {
                                            HStack {
                                                Text("Exam \(exam.examId)")
                                                    .cardTitle()
                                                    .foregroundStyle(AppColor.textPrimary)
                                                Spacer()
                                                if ep.answered > 0 {
                                                    PillBadge(
                                                        text: String(format: "%.0f%%", ep.score * 100),
                                                        fg: ep.score >= 0.7 ? AppColor.success : AppColor.danger,
                                                        bg: ep.score >= 0.7 ? AppColor.successSoft : AppColor.dangerSoft
                                                    )
                                                }
                                            }
                                            AppProgressBar(value: ep.pct, height: 4)
                                            HStack {
                                                Text("\(ep.answered)/\(ep.total) questions")
                                                    .captionText()
                                                    .foregroundStyle(AppColor.textMuted)
                                                Spacer()
                                                if ep.isComplete {
                                                    Text("Complete ✓")
                                                        .captionText()
                                                        .foregroundStyle(AppColor.success)
                                                } else {
                                                    Text("Continue →")
                                                        .captionText()
                                                        .foregroundStyle(AppColor.accent)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, AppSpacing.screenH)
                }
                .padding(.bottom, 100)
            }
        }
        .navigationTitle("")
        .navigationBarTitleDisplayMode(.inline)
        .overlay {
            if content.exams.isEmpty {
                ProgressView().tint(AppColor.accent)
            }
        }
    }
}
