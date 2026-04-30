import SwiftUI
import UIKit

struct AppRoot: View {
    @State private var selectedTab = 0
    @ObservedObject private var settings = SettingsStore.shared
    @ObservedObject private var content = ContentRepository.shared

    init() {
        configureTabBarAppearance()
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView(selectedTab: $selectedTab)
                .tabItem { Label("Home", systemImage: "house.fill") }
                .tag(0)

            FlashcardsView()
                .tabItem { Label("Flashcards", systemImage: "rectangle.stack.fill") }
                .tag(1)

            NavigationStack {
                ExamListView()
            }
            .tabItem { Label("Quiz", systemImage: "questionmark.circle.fill") }
            .tag(2)

            NavigationStack {
                SettingsView()
            }
            .tabItem { Label("Settings", systemImage: "gearshape.fill") }
            .tag(3)
        }
        .accentColor(AppColor.accent)
        .preferredColorScheme(settings.colorScheme)
        .task { await content.load() }
    }

    private func configureTabBarAppearance() {
        let appearance = UITabBarAppearance()
        appearance.configureWithDefaultBackground()
        appearance.backgroundEffect = UIBlurEffect(style: .systemUltraThinMaterial)
        appearance.backgroundColor = UIColor.clear
        appearance.shadowColor = UIColor(AppColor.border)
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}

#Preview {
    AppRoot()
}
