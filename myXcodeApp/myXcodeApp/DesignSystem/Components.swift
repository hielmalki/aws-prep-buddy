import SwiftUI

// MARK: - CardContainer

struct CardContainer<Content: View>: View {
    let content: () -> Content

    init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            content()
        }
        .padding(AppSpacing.card)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColor.surface, in: RoundedRectangle(cornerRadius: AppRadius.card))
        .overlay(
            RoundedRectangle(cornerRadius: AppRadius.card)
                .strokeBorder(AppColor.border, lineWidth: 0.5)
        )
        .cardShadow()
    }
}

// MARK: - IconBadge

struct IconBadge: View {
    let systemName: String
    let color: Color
    var size: CGFloat = 48

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: AppRadius.iconBadge)
                .fill(color.opacity(0.15))
                .frame(width: size, height: size)
            Image(systemName: systemName)
                .font(.system(size: size * 0.42, weight: .semibold))
                .foregroundStyle(color)
        }
    }
}

// MARK: - PillBadge

struct PillBadge: View {
    let text: String
    let fg: Color
    let bg: Color

    var body: some View {
        Text(text)
            .badgeText()
            .foregroundStyle(fg)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(bg, in: Capsule())
    }
}

// MARK: - DueBadge

struct DueBadge: View {
    let count: Int
    var color: Color = AppColor.danger

    var body: some View {
        Text("\(count) due")
            .badgeText()
            .foregroundStyle(color == AppColor.danger ? AppColor.danger : AppColor.accent)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(color == AppColor.danger ? AppColor.dangerSoft : AppColor.accentSoft, in: Capsule())
    }
}

struct RoundedBadge: View {
    let count: Int
    var color: Color = AppColor.accent

    var body: some View {
        Text("\(count)")
            .font(.appBadge)
            .foregroundStyle(.white)
            .frame(minWidth: 24, minHeight: 24)
            .padding(.horizontal, count > 9 ? 6 : 0)
            .background(color, in: Circle())
    }
}

// MARK: - SectionHeader

struct SectionHeader: View {
    let title: String

    var body: some View {
        Text(title)
            .font(.appCaption)
            .foregroundStyle(AppColor.textMuted)
            .padding(.top, 8)
            .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// MARK: - ScreenHeader

struct ScreenHeader: View {
    let eyebrow: String
    let title: String
    var subtitle: String? = nil
    var subtitleColor: Color = AppColor.textMuted

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(eyebrow)
                .badgeText()
                .foregroundStyle(AppColor.textMuted)
            Text(title)
                .mainTitle()
                .foregroundStyle(AppColor.textPrimary)
            if let subtitle = subtitle {
                Text(subtitle)
                    .font(.appBody)
                    .foregroundStyle(subtitleColor)
            }
        }
        .padding(.horizontal, AppSpacing.screenH)
        .padding(.top, 16)
        .padding(.bottom, 8)
    }
}

// MARK: - Custom Progress Bar

struct AppProgressBar: View {
    let value: Double  // 0...1
    var height: CGFloat = 6
    var color: Color = AppColor.accent
    var trackColor: Color = AppColor.surface3

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: height / 2)
                    .fill(trackColor)
                    .frame(height: height)
                RoundedRectangle(cornerRadius: height / 2)
                    .fill(color)
                    .frame(width: geo.size.width * min(1, max(0, value)), height: height)
            }
        }
        .frame(height: height)
    }
}

// MARK: - FAB (Floating Action Button)

struct FABButton: View {
    let systemName: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            ZStack {
                Circle()
                    .fill(AppColor.accent)
                    .frame(width: 52, height: 52)
                Image(systemName: systemName)
                    .font(.system(size: 22, weight: .semibold))
                    .foregroundStyle(.white)
            }
        }
        .fabShadow()
    }
}

// MARK: - Screen Background Modifier

extension View {
    func screenBackground() -> some View {
        self.background(AppColor.screen.ignoresSafeArea())
    }

    func cardPadding() -> some View {
        self.padding(.horizontal, AppSpacing.screenH)
    }
}

// MARK: - Chevron Row Helper

struct ChevronRow<Content: View>: View {
    let action: () -> Void
    @ViewBuilder let content: () -> Content

    var body: some View {
        Button(action: action) {
            HStack(spacing: AppSpacing.gap) {
                content()
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(AppColor.textMuted)
            }
        }
        .buttonStyle(.plain)
    }
}

// MARK: - BrandHeader

struct BrandHeader<Trailing: View>: View {
    let eyebrow: String
    let title: String
    let trailing: () -> Trailing

    init(eyebrow: String, title: String, @ViewBuilder trailing: @escaping () -> Trailing) {
        self.eyebrow = eyebrow
        self.title = title
        self.trailing = trailing
    }

    var body: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: 2) {
                Text(eyebrow)
                    .font(.appCaption)
                    .foregroundStyle(AppColor.textMuted)
                Text(title)
                    .font(.appBrandTitle)
                    .kerning(-0.5)
                    .foregroundStyle(AppColor.textPrimary)
            }
            Spacer()
            trailing()
        }
        .padding(.top, 64)
        .padding(.horizontal, 20)
        .padding(.bottom, 12)
    }
}

// MARK: - InnerHeader

struct InnerHeader: View {
    let eyebrow: String
    let title: String
    var subtitle: AttributedString? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(eyebrow)
                .font(.appCaption)
                .foregroundStyle(AppColor.textMuted)
            Text(title)
                .font(.appMainTitle)
                .foregroundStyle(AppColor.textPrimary)
                .lineLimit(1)
            if let s = subtitle {
                Text(s)
                    .font(.appBody)
                    .foregroundStyle(AppColor.textMuted)
                    .padding(.top, 4)
            }
        }
        .padding(.top, 60)
        .padding(.horizontal, 20)
        .padding(.bottom, 14)
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

// MARK: - DeckThumb

struct DeckThumb: View {
    let color: Color

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 7)
                .fill(color)
                .frame(width: 32, height: 36)
            Image(systemName: "rectangle.stack.fill")
                .font(.system(size: 16))
                .foregroundStyle(.white)
        }
    }
}

// MARK: - AccentReviewButton

struct AccentReviewButton: View {
    var label: String = "Review"
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 4) {
                Text(label)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(.white)
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(.white)
            }
            .padding(.horizontal, 18)
            .padding(.vertical, 10)
            .background(AppColor.accent, in: RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
    }
}

// MARK: - PromptChip

struct PromptChip: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.system(size: 11, weight: .medium))
            .foregroundStyle(AppColor.textMuted)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background {
                Capsule()
                    .fill(AppColor.surface2)
                    .overlay(
                        Capsule()
                            .strokeBorder(AppColor.border, lineWidth: 0.5)
                    )
            }
    }
}

// MARK: - ProgressRing

struct ProgressRing: View {
    let progress: Double
    let current: Int
    let target: Int
    var size: CGFloat = 96
    var strokeWidth: CGFloat = 9

    var body: some View {
        ZStack {
            Circle()
                .stroke(AppColor.surface3, lineWidth: strokeWidth)
            Circle()
                .trim(from: 0, to: progress)
                .stroke(
                    AppColor.accent,
                    style: StrokeStyle(lineWidth: strokeWidth, lineCap: .round)
                )
                .rotationEffect(.degrees(-90))
                .animation(.timingCurve(0.2, 0.8, 0.2, 1, duration: 0.8), value: progress)
            VStack(spacing: 1) {
                Text("\(current)")
                    .font(.system(size: 22, weight: .bold))
                    .kerning(-0.5)
                    .foregroundStyle(AppColor.textPrimary)
                Text("of \(target)")
                    .font(.system(size: 11))
                    .foregroundStyle(AppColor.textMuted)
            }
        }
        .frame(width: size, height: size)
    }
}

// MARK: - PillBadge tag variant

extension PillBadge {
    static func tag(text: String, fg: Color, bg: Color) -> some View {
        Text(text)
            .font(.system(size: 10, weight: .heavy))
            .kerning(0.5)
            .textCase(.uppercase)
            .foregroundStyle(fg)
            .padding(.horizontal, 8)
            .padding(.vertical, 2)
            .background(bg, in: RoundedRectangle(cornerRadius: 6))
    }
}
