import SwiftUI
import UIKit

// MARK: - Colors

enum AppColor {
    static var screen: Color       { adaptive(light: 0xF5F5F7, dark: 0x1C1C1E) }
    static var surface: Color      { adaptive(light: 0xFFFFFF, dark: 0x1C1C1E) }
    static var surface2: Color     { adaptive(light: 0xF5F5F7, dark: 0x2C2C2E) }
    static var surface3: Color     { adaptive(light: 0xE8E8ED, dark: 0x3A3A3C) }

    static var textPrimary: Color  { adaptive(light: 0x1D1D1F, dark: 0xF5F5F7) }
    static var textSecondary: Color { adaptive(light: 0x3A3A3C, dark: 0xD2D2D7) }
    static var textMuted: Color    { Color(hex: 0x86868B) }

    static var accent: Color       { adaptive(light: 0x0071E3, dark: 0x0A84FF) }
    static var accentSoft: Color   { adaptive(light: 0xE8F1FD, dark: 0x0A84FF, darkAlpha: 0.16) }

    static var success: Color      { adaptive(light: 0x248A3D, dark: 0x30D158) }
    static var successSoft: Color  { adaptive(light: 0xE3F8E9, dark: 0x30D158, darkAlpha: 0.16) }

    static var warning: Color      { adaptive(light: 0xC77700, dark: 0xFF9F0A) }
    static var warningSoft: Color  { adaptive(light: 0xFFF1D6, dark: 0xFF9F0A, darkAlpha: 0.16) }

    static var danger: Color       { adaptive(light: 0xD70015, dark: 0xFF453A) }
    static var dangerSoft: Color   { adaptive(light: 0xFFE5E7, dark: 0xFF453A, darkAlpha: 0.16) }

    static var info: Color         { Color(hex: 0x5E5CE6) }
    static var infoSoft: Color     { adaptive(light: 0xEAE9FB, dark: 0x5E5CE6, darkAlpha: 0.16) }

    static var border: Color       { adaptive(light: 0x000000, lightAlpha: 0.08, dark: 0xFFFFFF, darkAlpha: 0.10) }
    static var borderStrong: Color { adaptive(light: 0x000000, lightAlpha: 0.16, dark: 0xFFFFFF, darkAlpha: 0.18) }

    static var accentHair: Color   { adaptive(light: 0x0071E3, lightAlpha: 0.22, dark: 0x0A84FF, darkAlpha: 0.32) }
    static var text2: Color        { adaptive(light: 0x3A3A3C, dark: 0xD2D2D7) }
    static var textSubtle: Color   { adaptive(light: 0xD2D2D7, dark: 0x48484A) }

    @MainActor
    static var bgGrad: LinearGradient {
        let isLight = UITraitCollection.current.userInterfaceStyle != .dark
        return LinearGradient(
            colors: isLight
                ? [Color(hex: 0xFBFBFD), Color(hex: 0xF5F5F7)]
                : [Color(hex: 0x000000), Color(hex: 0x1C1C1E)],
            startPoint: .top,
            endPoint: .bottom
        )
    }

    // Deck icon colors (deterministic from deckId)
    static func deckColor(for deckId: String) -> Color {
        let palette: [Color] = [accent, danger, success, info]
        let index = (deckId.hashValue & 0x7fffffff) % palette.count
        return palette[index]
    }

    // MARK: - Private helpers
    private static func adaptive(light: UInt32, lightAlpha: Double = 1, dark: UInt32, darkAlpha: Double = 1) -> Color {
        Color(uiColor: UIColor { trait in
            trait.userInterfaceStyle == .dark
                ? UIColor(Color(hex: dark).opacity(darkAlpha))
                : UIColor(Color(hex: light).opacity(lightAlpha))
        })
    }

    private static func adaptive(light: UInt32, dark: UInt32, darkAlpha: Double) -> Color {
        adaptive(light: light, lightAlpha: 1, dark: dark, darkAlpha: darkAlpha)
    }
}

extension Color {
    init(hex: UInt32) {
        let r = Double((hex >> 16) & 0xFF) / 255
        let g = Double((hex >> 8) & 0xFF) / 255
        let b = Double(hex & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}

// MARK: - Spacing

enum AppSpacing {
    static let screenH: CGFloat = 20
    static let section: CGFloat = 24
    static let card: CGFloat = 16
    static let gap: CGFloat = 12
    static let rowV: CGFloat = 14
}

// MARK: - Radius

enum AppRadius {
    static let card: CGFloat = 16
    static let cardLarge: CGFloat = 20
    static let badge: CGFloat = 10
    static let iconBadge: CGFloat = 12
}

// MARK: - Shadow

private struct CardShadowAdaptiveModifier: ViewModifier {
    @Environment(\.colorScheme) private var colorScheme

    func body(content: Content) -> some View {
        if colorScheme == .dark {
            content
                .shadow(color: .black.opacity(0.04), radius: 1, x: 0, y: 1)
                .overlay(
                    RoundedRectangle(cornerRadius: AppRadius.card)
                        .strokeBorder(Color.white.opacity(0.04), lineWidth: 1)
                )
        } else {
            content
                .shadow(color: .black.opacity(0.04), radius: 1, x: 0, y: 1)
                .shadow(color: .black.opacity(0.04), radius: 0, x: 0, y: 0)
        }
    }
}

extension View {
    func cardShadow() -> some View {
        self
            .shadow(color: .black.opacity(0.04), radius: 1, x: 0, y: 1)
            .shadow(color: .black.opacity(0.04), radius: 0, x: 0, y: 0)
    }

    func cardShadowAdaptive() -> some View {
        modifier(CardShadowAdaptiveModifier())
    }

    func fabShadow() -> some View {
        self
            .shadow(color: AppColor.accent.opacity(0.40), radius: 12, x: 0, y: 8)
            .shadow(color: .black.opacity(0.12), radius: 4, x: 0, y: 2)
    }
}
