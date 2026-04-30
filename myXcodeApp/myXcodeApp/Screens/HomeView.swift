import SwiftUI

struct HomeView: View {
    @Binding var selectedTab: Int
    @ObservedObject private var progress = ProgressStore.shared
    @ObservedObject private var streak = StreakStore.shared
    @ObservedObject private var settings = SettingsStore.shared
    @ObservedObject private var content = ContentRepository.shared
    @State private var showTutor = false
    @State private var showLearn = false
    @State private var showExams = false

    var body: some View {
        ZStack(alignment: .top) {
            AppColor.screen.ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: AppSpacing.gap) {
                    header
                        .padding(.horizontal, AppSpacing.screenH)
                    streakCard.cardPadding()
                    dailyGoalCard.cardPadding()
                    continueOrBrowseSection.cardPadding()
                    statsGrid.cardPadding()
                    tutorCard.cardPadding()
                }
                .padding(.top, 16)
                .padding(.bottom, 120)
            }
        }
        .navigationBarHidden(true)
        .sheet(isPresented: $showTutor) {
            TutorSheet(context: TutorContext())
        }
        .navigationDestination(isPresented: $showExams) {
            ExamListView()
        }
        .navigationDestination(isPresented: $showLearn) {
            LearnIndexView()
        }
    }

    // MARK: - Header

    private var header: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 4) {
                Text("Today")
                    .badgeText()
                    .foregroundStyle(AppColor.textMuted)
                Text("AWS Prep")
                    .mainTitle()
                    .foregroundStyle(AppColor.textPrimary)
            }
            Spacer()
            NavigationLink(destination: SettingsView()) {
                ZStack {
                    Circle()
                        .fill(AppColor.surface)
                        .frame(width: 38, height: 38)
                        .overlay(Circle().strokeBorder(AppColor.border, lineWidth: 0.5))
                    Image(systemName: "gearshape.fill")
                        .font(.system(size: 16, weight: .medium))
                        .foregroundStyle(AppColor.textSecondary)
                }
            }
        }
    }

    // MARK: - Streak Card

    private var streakCard: some View {
        CardContainer {
            HStack(spacing: AppSpacing.gap) {
                IconBadge(systemName: "flame.fill", color: .orange, size: 48)
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(streak.currentStreak)-day streak")
                        .cardTitle()
                        .foregroundStyle(AppColor.textPrimary)
                    Text("Longest: \(streak.longestStreak) days")
                        .captionText()
                        .foregroundStyle(AppColor.textMuted)
                }
                Spacer()
                Text(streak.currentStreak > 0 ? "Keep it up!" : "Start today!")
                    .font(.appCaption)
                    .foregroundStyle(AppColor.textMuted)
            }
        }
    }

    // MARK: - Daily Goal Card

    private var dailyGoalCard: some View {
        let stats = progress.stats
        let pct = min(1.0, Double(stats.todayAnswered) / Double(max(1, settings.dailyGoal)))
        return CardContainer {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Text("Daily Goal")
                        .cardTitle()
                        .foregroundStyle(AppColor.textPrimary)
                    Spacer()
                    Text("\(stats.todayAnswered) / \(settings.dailyGoal)")
                        .font(.appSubtitle)
                        .foregroundStyle(AppColor.textMuted)
                }
                AppProgressBar(value: pct)
            }
        }
    }

    // MARK: - Continue / Browse Section

    @ViewBuilder
    private var continueOrBrowseSection: some View {
        let exams = content.exams
        if let firstIncomplete = exams.first(where: { !progress.examProgress(exam: $0).isComplete }) {
            continueCard(exam: firstIncomplete)
        } else {
            browseSection
        }
    }

    private func continueCard(exam: ContentExam) -> some View {
        let ep = progress.examProgress(exam: exam)
        return Button(action: { selectedTab = 2 }) {
            CardContainer {
                HStack(spacing: AppSpacing.gap) {
                    IconBadge(systemName: "doc.text.fill", color: AppColor.accent, size: 44)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Continue Exam \(exam.examId)")
                            .cardTitle()
                            .foregroundStyle(AppColor.textPrimary)
                        Text("\(ep.answered) / \(ep.total) answered")
                            .captionText()
                            .foregroundStyle(AppColor.textMuted)
                        AppProgressBar(value: ep.pct, height: 4)
                            .padding(.top, 2)
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(AppColor.textMuted)
                }
            }
        }
        .buttonStyle(.plain)
    }

    private var browseSection: some View {
        VStack(alignment: .leading, spacing: AppSpacing.gap) {
            SectionHeader(title: "Browse")
            CardContainer {
                VStack(spacing: 0) {
                    NavigationLink(destination: ExamListView()) {
                        HStack(spacing: AppSpacing.gap) {
                            IconBadge(systemName: "doc.text.fill", color: AppColor.accent, size: 40)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Practice Exams").cardTitle().foregroundStyle(AppColor.textPrimary)
                                Text("CLF-C02 questions").captionText().foregroundStyle(AppColor.textMuted)
                            }
                            Spacer()
                            Image(systemName: "chevron.right").font(.system(size: 13, weight: .semibold)).foregroundStyle(AppColor.textMuted)
                        }
                        .padding(.vertical, 4)
                    }
                    .buttonStyle(.plain)
                    Divider().padding(.vertical, 8)
                    NavigationLink(destination: LearnIndexView()) {
                        HStack(spacing: AppSpacing.gap) {
                            IconBadge(systemName: "book.fill", color: AppColor.info, size: 40)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Learn").cardTitle().foregroundStyle(AppColor.textPrimary)
                                Text("Study modules").captionText().foregroundStyle(AppColor.textMuted)
                            }
                            Spacer()
                            Image(systemName: "chevron.right").font(.system(size: 13, weight: .semibold)).foregroundStyle(AppColor.textMuted)
                        }
                        .padding(.vertical, 4)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: - Stats Grid

    private var statsGrid: some View {
        let stats = progress.stats
        return HStack(spacing: AppSpacing.gap) {
            StatCard(value: String(format: "%.0f%%", stats.avgScore * 100), label: "Avg Score")
            StatCard(value: "\(stats.totalAnswered)", label: "Answered")
            StatCard(value: "\(stats.correctCount)", label: "Correct")
        }
    }

    // MARK: - Tutor Card

    private var tutorCard: some View {
        Button(action: { showTutor = true }) {
            CardContainer {
                HStack(spacing: AppSpacing.gap) {
                    IconBadge(systemName: "sparkles", color: AppColor.info, size: 44)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Ask AI Tutor")
                            .cardTitle()
                            .foregroundStyle(AppColor.textPrimary)
                        Text("Powered by GPT-4o mini")
                            .captionText()
                            .foregroundStyle(AppColor.textMuted)
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(AppColor.textMuted)
                }
            }
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Stat Card

struct StatCard: View {
    let value: String
    let label: String

    var body: some View {
        CardContainer {
            VStack(spacing: 4) {
                Text(value)
                    .largeTitle()
                    .foregroundStyle(AppColor.textPrimary)
                Text(label)
                    .captionText()
                    .foregroundStyle(AppColor.textMuted)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 4)
        }
    }
}
