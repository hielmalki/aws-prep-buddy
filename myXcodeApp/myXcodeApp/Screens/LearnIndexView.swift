import SwiftUI

struct LearnIndexView: View {
    @ObservedObject private var content = ContentRepository.shared
    @State private var searchText = ""

    private var filtered: [ContentSection] {
        if searchText.isEmpty { return content.sections }
        return content.sections.filter {
            $0.title.localizedCaseInsensitiveContains(searchText) ||
            $0.topics.contains { $0.localizedCaseInsensitiveContains(searchText) }
        }
    }

    var body: some View {
        ZStack {
            AppColor.screen.ignoresSafeArea()
            VStack(spacing: 0) {
                searchBar
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: AppSpacing.gap) {
                        ScreenHeader(
                            eyebrow: "AWS Cloud Practitioner",
                            title: "Learn",
                            subtitle: "\(content.sections.count) modules",
                            subtitleColor: AppColor.accent
                        )
                        .padding(.horizontal, 0)

                        if filtered.isEmpty {
                            Text("No results for \"\(searchText)\"")
                                .captionText()
                                .foregroundStyle(AppColor.textMuted)
                                .padding(.horizontal, AppSpacing.screenH)
                        } else {
                            VStack(spacing: AppSpacing.gap) {
                                // Flashcards Card
                                NavigationLink(destination: FlashcardsView()) {
                                    HStack(spacing: 12) {
                                        RoundedRectangle(cornerRadius: 11)
                                            .fill(AppColor.accentSoft)
                                            .frame(width: 44, height: 44)
                                            .overlay {
                                                Image(systemName: "rectangle.stack.fill")
                                                    .font(.system(size: 22))
                                                    .foregroundStyle(AppColor.accent)
                                            }
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text("Anki-Style · SM-2")
                                                .font(.system(size: 11, weight: .bold))
                                                .kerning(0.5)
                                                .textCase(.uppercase)
                                                .foregroundStyle(AppColor.textMuted)
                                            Text("Flashcards")
                                                .font(.system(size: 15, weight: .semibold))
                                                .foregroundStyle(AppColor.textPrimary)
                                            Text("Daily flashcard review")
                                                .font(.system(size: 12))
                                                .foregroundStyle(AppColor.textMuted)
                                        }
                                        Spacer()
                                        Image(systemName: "chevron.right")
                                            .font(.system(size: 16))
                                            .foregroundStyle(AppColor.textMuted)
                                    }
                                    .padding(14)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .background(AppColor.surface, in: RoundedRectangle(cornerRadius: 14))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 14)
                                            .strokeBorder(AppColor.border, lineWidth: 0.5)
                                    )
                                }
                                .buttonStyle(.plain)

                                // Mindmap Card
                                Button(action: {}) {
                                    HStack(spacing: 12) {
                                        RoundedRectangle(cornerRadius: 11)
                                            .fill(AppColor.accentSoft)
                                            .frame(width: 44, height: 44)
                                            .overlay {
                                                Image(systemName: "map.fill")
                                                    .font(.system(size: 22))
                                                    .foregroundStyle(AppColor.accent)
                                            }
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text("Übersicht")
                                                .font(.system(size: 11, weight: .bold))
                                                .kerning(0.5)
                                                .textCase(.uppercase)
                                                .foregroundStyle(AppColor.accent)
                                            Text("AWS-Service-Mindmap")
                                                .font(.system(size: 15, weight: .semibold))
                                                .foregroundStyle(AppColor.textPrimary)
                                            Text("Visuelle Übersicht aller Services")
                                                .font(.system(size: 12))
                                                .foregroundStyle(AppColor.textMuted)
                                        }
                                        Spacer()
                                        Image(systemName: "chevron.right")
                                            .font(.system(size: 16))
                                            .foregroundStyle(AppColor.textMuted)
                                    }
                                    .padding(14)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .background(AppColor.surface, in: RoundedRectangle(cornerRadius: 14))
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 14)
                                            .strokeBorder(AppColor.accent, lineWidth: 1)
                                    )
                                }
                                .buttonStyle(.plain)

                                ForEach(filtered) { section in
                                    NavigationLink(destination: LearnModuleView(section: section)) {
                                        CardContainer {
                                            HStack(spacing: AppSpacing.gap) {
                                                IconBadge(systemName: "book.closed.fill", color: AppColor.info, size: 44)
                                                VStack(alignment: .leading, spacing: 4) {
                                                    Text(section.title)
                                                        .cardTitle()
                                                        .foregroundStyle(AppColor.textPrimary)
                                                    Text(section.topics.prefix(3).joined(separator: " · "))
                                                        .captionText()
                                                        .foregroundStyle(AppColor.textMuted)
                                                        .lineLimit(1)
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
                            .padding(.horizontal, AppSpacing.screenH)
                        }
                    }
                    .padding(.bottom, 100)
                }
            }
        }
        .navigationTitle("")
        .navigationBarTitleDisplayMode(.inline)
    }

    private var searchBar: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(AppColor.textMuted)
                .font(.system(size: 15))
            TextField("Search topics…", text: $searchText)
                .font(.appBody)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(AppColor.surface, in: RoundedRectangle(cornerRadius: 12))
        .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(AppColor.border, lineWidth: 0.5))
        .padding(.horizontal, AppSpacing.screenH)
        .padding(.vertical, 10)
    }
}
