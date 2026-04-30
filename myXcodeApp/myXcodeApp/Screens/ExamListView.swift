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
                                        IconBadge(systemName: "list.bullet.rectangle", color: AppColor.accent, size: 44)
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text("EXAM \(exam.examId)")
                                                .font(.system(size: 11, weight: .bold))
                                                .kerning(0.5)
                                                .textCase(.uppercase)
                                                .foregroundStyle(AppColor.textMuted)
                                            Text("Practice Exam \(exam.examId)")
                                                .font(.system(size: 15, weight: .semibold))
                                                .foregroundStyle(AppColor.textPrimary)
                                            Text("\(ep.total) questions")
                                                .font(.system(size: 12))
                                                .foregroundStyle(AppColor.textMuted)
                                        }
                                        Spacer()
                                        if ep.isComplete {
                                            HStack(spacing: 4) {
                                                Image(systemName: "checkmark.circle.fill")
                                                    .font(.system(size: 14))
                                                    .foregroundStyle(AppColor.success)
                                                Text("\(Int(ep.score * 100))%")
                                                    .font(.system(size: 14, weight: .semibold))
                                                    .foregroundStyle(AppColor.success)
                                            }
                                        } else if ep.answered > 0 {
                                            Text("\(ep.answered)/\(ep.total)")
                                                .font(.system(size: 13, weight: .medium))
                                                .foregroundStyle(AppColor.textMuted)
                                        } else {
                                            Image(systemName: "chevron.right")
                                                .font(.system(size: 16))
                                                .foregroundStyle(AppColor.textMuted)
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
