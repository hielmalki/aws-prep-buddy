import SwiftUI

struct HomeView: View {
    @Binding var selectedTab: Int
    @ObservedObject private var progress = ProgressStore.shared
    @ObservedObject private var streak = StreakStore.shared
    @ObservedObject private var settings = SettingsStore.shared
    @ObservedObject private var content = ContentRepository.shared
    @Environment(\.colorScheme) private var colorScheme
    @State private var showTutor = false

    // MARK: - Derived values

    private var stats: ProgressStats { progress.stats }
    private var dailyGoal: Int { settings.dailyGoal }
    private var todayAnswered: Int { stats.todayAnswered }
    private var progressPct: Double {
        min(1.0, Double(todayAnswered) / Double(max(dailyGoal, 1)))
    }

    private var firstIncompleteExam: ContentExam? {
        content.exams.first(where: { !progress.examProgress(exam: $0).isComplete })
    }

    private var continueExam: ContentExam {
        firstIncompleteExam ?? content.exams.first ?? ContentExam(examId: 1, questions: [])
    }

    private var examProgress: ExamProgress {
        progress.examProgress(exam: continueExam)
    }

    private var continueQ: Int {
        progress.nextUnanswered(exam: continueExam)?.number ?? 1
    }

    private var examPct: Double { examProgress.pct }
    private var examAnswered: Int { examProgress.answered }

    // MARK: - Body

    var body: some View {
        ZStack(alignment: .top) {
            AppColor.screen.ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 0) {
                    // Header
                    BrandHeader(eyebrow: "Ready to learn 👋", title: "AWS Prep Buddy") {
                        themeToggleButton
                    }

                    VStack(alignment: .leading, spacing: 0) {
                        // Hero Card
                        heroCard
                            .padding(.top, 8)

                        // Continue Learning Section
                        continueLearningSection
                            .padding(.top, 24)

                        // Get Help Section
                        getHelpSection
                            .padding(.top, 24)

                        // Stats Grid
                        statsGrid
                            .padding(.top, 24)
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 120)
                }
            }
        }
        .navigationBarHidden(true)
        .sheet(isPresented: $showTutor) {
            TutorSheet(context: TutorContext())
        }
    }

    // MARK: - Theme Toggle Button

    private var themeToggleButton: some View {
        Button {
            settings.theme = (colorScheme == .dark) ? "light" : "dark"
        } label: {
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(AppColor.surface)
                    .frame(width: 38, height: 38)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .strokeBorder(AppColor.border, lineWidth: 0.5)
                    )
                Image(systemName: colorScheme == .dark ? "sun.max.fill" : "moon.fill")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundStyle(AppColor.textPrimary)
            }
        }
        .buttonStyle(.plain)
    }

    // MARK: - Hero Card

    private var heroCard: some View {
        CardContainer {
            HStack(spacing: 16) {
                ProgressRing(
                    progress: progressPct,
                    current: todayAnswered,
                    target: dailyGoal,
                    size: 96,
                    strokeWidth: 9
                )

                VStack(alignment: .leading, spacing: 0) {
                    // Streak pill
                    HStack(spacing: 6) {
                        Image(systemName: "flame.fill")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundStyle(AppColor.accent)
                        Text("\(streak.currentStreak) DAY STREAK")
                            .font(.system(size: 11, weight: .bold))
                            .kerning(0.3)
                            .foregroundStyle(AppColor.accent)
                    }
                    .padding(.horizontal, 9)
                    .padding(.vertical, 4)
                    .background(AppColor.accentSoft, in: Capsule())

                    Text("Daily goal")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(AppColor.textPrimary)
                        .padding(.top, 8)

                    Text(dailyGoalMessage)
                        .font(.system(size: 12))
                        .foregroundStyle(AppColor.textMuted)
                        .padding(.top, 2)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
        }
    }

    private var dailyGoalMessage: String {
        if stats.totalAnswered == 0 {
            return "Start your first quiz 🚀"
        } else if todayAnswered >= dailyGoal {
            return "Daily goal reached 🎉"
        } else {
            return "\(dailyGoal - todayAnswered) questions to go 🔥"
        }
    }

    // MARK: - Continue Learning

    private var continueLearningSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("CONTINUE LEARNING")
                .font(.system(size: 11, weight: .bold))
                .kerning(1)
                .foregroundStyle(AppColor.textMuted)

            continueCard
        }
    }

    private var continueCard: some View {
        let hasStarted = stats.totalAnswered > 0
        let examId = continueExam.examId
        let titleText = hasStarted
            ? "Continue — Practice Exam \(examId)"
            : "Start Practice Exam 1"
        let subtitleText = hasStarted
            ? "Question \(continueQ)"
            : "Question 1 of 50"
        let scoreText = examAnswered > 0
            ? String(format: "%.0f%%", examPct * 100)
            : "—"
        let scoreColor: Color = examAnswered > 0 ? AppColor.accent : AppColor.textMuted

        return Button(action: { selectedTab = 2 }) {
            CardContainer {
                VStack(spacing: 0) {
                    HStack(spacing: 12) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 12)
                                .fill(AppColor.accentSoft)
                                .frame(width: 42, height: 42)
                            Image(systemName: "target")
                                .font(.system(size: 22, weight: .semibold))
                                .foregroundStyle(AppColor.accent)
                        }

                        VStack(alignment: .leading, spacing: 2) {
                            Text(titleText)
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundStyle(AppColor.textPrimary)
                            Text(subtitleText)
                                .font(.system(size: 12))
                                .foregroundStyle(AppColor.textMuted)
                        }

                        Spacer()

                        Text(scoreText)
                            .font(.system(size: 18, weight: .bold))
                            .kerning(-0.5)
                            .foregroundStyle(scoreColor)
                    }

                    AppProgressBar(value: examPct, height: 4)
                        .padding(.top, 12)
                }
            }
        }
        .buttonStyle(.plain)
    }

    // MARK: - Get Help / AI Tutor

    private var getHelpSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("GET HELP")
                .font(.system(size: 11, weight: .bold))
                .kerning(1)
                .foregroundStyle(AppColor.textMuted)

            tutorCard
        }
    }

    private var tutorCard: some View {
        Button(action: { showTutor = true }) {
            CardContainer {
                VStack(spacing: 0) {
                    HStack(spacing: 12) {
                        ZStack {
                            RoundedRectangle(cornerRadius: 14)
                                .fill(AppColor.accent)
                                .frame(width: 48, height: 48)
                                .shadow(color: AppColor.accent.opacity(0.35), radius: 10, x: 0, y: 6)
                            Image(systemName: "sparkles")
                                .font(.system(size: 24, weight: .semibold))
                                .foregroundStyle(.white)
                        }

                        VStack(alignment: .leading, spacing: 2) {
                            Text("AI Tutor")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundStyle(AppColor.textPrimary)
                            Text("Claude & GPT · explains what's not clicking")
                                .font(.system(size: 12))
                                .foregroundStyle(AppColor.textMuted)
                        }

                        Spacer()

                        Image(systemName: "chevron.right")
                            .font(.system(size: 18))
                            .foregroundStyle(AppColor.textMuted)
                    }

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 8) {
                            PromptChip(text: "What is a NAT Gateway?")
                            PromptChip(text: "S3 vs EFS?")
                            PromptChip(text: "IAM explained")
                        }
                    }
                    .padding(.top, 14)
                }
            }
        }
        .buttonStyle(.plain)
    }

    // MARK: - Stats Grid

    private var statsGrid: some View {
        HStack(spacing: 10) {
            HomeStatCard(
                icon: "trophy.fill",
                iconColor: AppColor.accent,
                value: stats.totalAnswered > 0
                    ? String(format: "%.0f%%", stats.avgScore * 100)
                    : "—",
                label: "Avg Score"
            )
            HomeStatCard(
                icon: "checkmark.circle.fill",
                iconColor: AppColor.textPrimary,
                value: "\(stats.totalAnswered)",
                label: "Answered"
            )
            HomeStatCard(
                icon: "flame.fill",
                iconColor: AppColor.textPrimary,
                value: "\(streak.currentStreak)d",
                label: "Streak"
            )
        }
    }
}

// MARK: - StatCard (legacy — used by SettingsView)

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

// MARK: - HomeStatCard

struct HomeStatCard: View {
    let icon: String
    let iconColor: Color
    let value: String
    let label: String

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Image(systemName: icon)
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(iconColor)

            Text(value)
                .font(.system(size: 18, weight: .bold))
                .kerning(-0.4)
                .foregroundStyle(AppColor.textPrimary)
                .padding(.top, 4)

            Text(label)
                .font(.system(size: 11, weight: .medium))
                .foregroundStyle(AppColor.textMuted)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColor.surface, in: RoundedRectangle(cornerRadius: 14))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .strokeBorder(AppColor.border, lineWidth: 1)
        )
        .cardShadowAdaptive()
    }
}
