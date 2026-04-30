import SwiftUI

// MARK: - App Fonts

extension Font {
    static var appMainTitle: Font  { .system(size: 34, weight: .bold) }
    static var appLargeTitle: Font { .system(size: 26, weight: .heavy) }
    static var appSection: Font    { .system(size: 22, weight: .bold) }
    static var appCardTitle: Font  { .system(size: 17, weight: .semibold) }
    static var appBody: Font       { .system(size: 15, weight: .semibold) }
    static var appSubtitle: Font   { .system(size: 14, weight: .semibold) }
    static var appCaption: Font    { .system(size: 13, weight: .medium) }
    static var appBadge: Font      { .system(size: 11, weight: .bold) }
    static var appBrandTitle: Font { .system(size: 22, weight: .bold) }
    static var appHeroNumber: Font { .system(size: 52, weight: .heavy) }
}

// MARK: - Text Modifiers

extension Text {
    func mainTitle() -> some View {
        self.font(.appMainTitle).kerning(-0.8)
    }

    func largeTitle() -> some View {
        self.font(.appLargeTitle).kerning(-0.8)
    }

    func sectionTitle() -> some View {
        self.font(.appSection).kerning(-0.5)
    }

    func cardTitle() -> some View {
        self.font(.appCardTitle).kerning(-0.3)
    }

    func bodyText() -> some View {
        self.font(.appBody).kerning(-0.1)
    }

    func captionText() -> some View {
        self.font(.appCaption)
    }

    func badgeText() -> some View {
        self.font(.appBadge).kerning(0.3).textCase(.uppercase)
    }

    func brandTitle() -> some View {
        self.font(.appBrandTitle).kerning(-0.5)
    }

    func heroNumber() -> some View {
        self.font(.appHeroNumber).kerning(-1.0)
    }
}
