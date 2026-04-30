import SwiftUI

struct SettingsView: View {
    @ObservedObject private var settings = SettingsStore.shared
    @ObservedObject private var progress = ProgressStore.shared
    @ObservedObject private var content = ContentRepository.shared
    @State private var showResetAlert = false
    @State private var apiKeyVisible = false
    @State private var apiKeySaved = false

    var body: some View {
        ZStack {
            AppColor.screen.ignoresSafeArea()
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: AppSpacing.gap) {
                    // Header mit Theme-Toggle
                    BrandHeader(eyebrow: "Preferences", title: "Du") {
                        Button(action: { toggleTheme() }) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(AppColor.surface)
                                    .frame(width: 38, height: 38)
                                    .overlay {
                                        RoundedRectangle(cornerRadius: 12)
                                            .strokeBorder(AppColor.border, lineWidth: 0.5)
                                    }
                                Image(systemName: settings.theme == "dark" ? "sun.max.fill" : "moon.fill")
                                    .font(.system(size: 18))
                                    .foregroundStyle(AppColor.textPrimary)
                            }
                        }
                    }

                    // Stats
                    let stats = progress.stats
                    HStack(spacing: AppSpacing.gap) {
                        StatCard(value: String(format: "%.0f%%", stats.avgScore * 100), label: "Avg Score")
                        StatCard(value: "\(stats.totalAnswered)", label: "Answered")
                        StatCard(value: "\(stats.currentStreak)d", label: "Streak")
                    }
                    .padding(.horizontal, AppSpacing.screenH)

                    // AI
                    settingsSection("AI Tutor") {
                        HStack(spacing: 10) {
                            Image(systemName: "key.fill")
                                .foregroundStyle(AppColor.textMuted)
                                .frame(width: 20)
                            Group {
                                if apiKeyVisible {
                                    TextField("sk-…", text: $settings.openAIKey)
                                } else {
                                    SecureField("sk-…", text: $settings.openAIKey)
                                }
                            }
                            .font(.appBody)
                            .autocorrectionDisabled()
                            .textInputAutocapitalization(.never)
                            .textContentType(.oneTimeCode)
                            .onChange(of: settings.openAIKey) { _ in apiKeySaved = false }
                            Button(action: { apiKeyVisible.toggle() }) {
                                Image(systemName: apiKeyVisible ? "eye.slash" : "eye")
                                    .foregroundStyle(AppColor.textMuted)
                            }
                        }
                        Divider()
                        Button(action: {
                            apiKeySaved = true
                            UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
                        }) {
                            HStack {
                                Spacer()
                                Text(apiKeySaved ? "Gespeichert ✓" : "Speichern")
                                    .font(.appBody)
                                    .fontWeight(.semibold)
                                    .foregroundStyle(apiKeySaved ? AppColor.success : AppColor.accent)
                                Spacer()
                            }
                        }
                        .disabled(settings.openAIKey.isEmpty)
                        Divider()
                        if !settings.openAIKey.isEmpty {
                            Text("Aktiv: sk-…\(settings.openAIKey.suffix(4))")
                                .captionText()
                                .foregroundStyle(AppColor.textMuted)
                            Divider()
                        }
                        Text("Uses gpt-4o-mini. Stored locally only.")
                            .captionText()
                            .foregroundStyle(AppColor.textMuted)
                    }

                    // Daily Goal
                    settingsSection("Daily Goal") {
                        VStack(alignment: .leading, spacing: 10) {
                            HStack {
                                Text("\(settings.dailyGoal) questions per day")
                                    .font(.appBody)
                                    .foregroundStyle(AppColor.textPrimary)
                                Spacer()
                            }
                            Slider(value: Binding(
                                get: { Double(settings.dailyGoal) },
                                set: { settings.dailyGoal = Int($0) }
                            ), in: 1...50, step: 1)
                            .accentColor(AppColor.accent)
                            HStack {
                                Text("1").captionText().foregroundStyle(AppColor.textMuted)
                                Spacer()
                                Text("50").captionText().foregroundStyle(AppColor.textMuted)
                            }
                        }
                    }

                    // Exam History
                    let examsWithProgress = content.exams.filter { progress.examProgress(exam: $0).answered > 0 }
                    if !examsWithProgress.isEmpty {
                        VStack(alignment: .leading, spacing: AppSpacing.gap) {
                            SectionHeader(title: "Exam History")
                                .padding(.horizontal, AppSpacing.screenH)
                            CardContainer {
                                VStack(spacing: 0) {
                                    ForEach(Array(examsWithProgress.enumerated()), id: \.element.examId) { idx, exam in
                                        let ep = progress.examProgress(exam: exam)
                                        HStack {
                                            Text("Exam \(exam.examId)")
                                                .font(.appBody).foregroundStyle(AppColor.textPrimary)
                                            Spacer()
                                            Text(String(format: "%.0f%%", ep.score * 100))
                                                .font(.appCardTitle)
                                                .foregroundStyle(ep.score >= 0.7 ? AppColor.success : AppColor.danger)
                                            Text("\(ep.answered)/\(ep.total)")
                                                .captionText().foregroundStyle(AppColor.textMuted)
                                        }
                                        .padding(.vertical, 8)
                                        if idx < examsWithProgress.count - 1 { Divider() }
                                    }
                                }
                            }
                            .padding(.horizontal, AppSpacing.screenH)
                        }
                    }

                    // Reset
                    Button(role: .destructive, action: { showResetAlert = true }) {
                        CardContainer {
                            HStack {
                                Image(systemName: "trash").foregroundStyle(AppColor.danger)
                                Text("Reset All Progress")
                                    .font(.appBody).foregroundStyle(AppColor.danger)
                            }
                        }
                    }
                    .buttonStyle(.plain)
                    .padding(.horizontal, AppSpacing.screenH)
                }
                .padding(.bottom, 100)
            }
        }
        .navigationTitle("")
        .navigationBarTitleDisplayMode(.inline)
        .alert("Reset All Progress?", isPresented: $showResetAlert) {
            Button("Reset", role: .destructive) { resetProgress() }
            Button("Cancel", role: .cancel) {}
        } message: { Text("All answers, streaks, and flashcards will be deleted.") }
    }

    private func settingsSection<Content: View>(_ title: String, @ViewBuilder content: @escaping () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            SectionHeader(title: title)
                .padding(.horizontal, AppSpacing.screenH)
            CardContainer { content() }
                .padding(.horizontal, AppSpacing.screenH)
        }
    }

    private func resetProgress() {
        StorageService.shared.clearTable("answers")
        StorageService.shared.clearTable("streak")
        StorageService.shared.clearTable("decks")
        StorageService.shared.clearTable("cards")
        StorageService.shared.clearTable("tutor_memory")
    }

    private func toggleTheme() {
        if settings.theme == "dark" {
            settings.theme = "light"
        } else {
            settings.theme = "dark"
        }
    }
}
