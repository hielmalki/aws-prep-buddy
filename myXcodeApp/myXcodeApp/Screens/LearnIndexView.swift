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
