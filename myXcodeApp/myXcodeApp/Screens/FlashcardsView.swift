import SwiftUI

struct FlashcardsView: View {
    @ObservedObject private var store = FlashcardStore.shared
    @State private var showNewDeck = false
    @State private var newDeckName = ""
    @State private var deckToDelete: FlashcardDeck?
    @State private var showGenerating = false
    @State private var deckForReview: FlashcardDeck?
    @State private var navigateToDeck = false

    // MARK: - Subtitle

    private var headerSubtitle: AttributedString {
        let totalDue = store.totalDueCount
        let totalDecks = store.decks.count

        var dueStr = AttributedString("\(totalDue)")
        dueStr.foregroundColor = UIColor(AppColor.accent)
        dueStr.font = UIFont.systemFont(ofSize: 14, weight: .semibold)

        var restStr = AttributedString(" cards due today")
        restStr.foregroundColor = UIColor(AppColor.textMuted)

        var result = dueStr + restStr

        if totalDecks > 0 {
            var deckStr = AttributedString(" · \(totalDecks) \(totalDecks == 1 ? "deck" : "decks")")
            deckStr.foregroundColor = UIColor(AppColor.textMuted)
            result += deckStr
        }
        return result
    }

    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottomTrailing) {
                AppColor.screen.ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 0) {
                        // Flat header above scroll content
                        InnerHeader(
                            eyebrow: "Review",
                            title: "Flashcards",
                            subtitle: headerSubtitle
                        )

                        LazyVStack(alignment: .leading, spacing: AppSpacing.gap) {
                            // Auto-deck cards
                            ForEach(store.autoDecks()) { deck in
                                autoDeckCard(deck)
                                    .padding(.horizontal, AppSpacing.screenH)
                            }

                            // AI Generate row
                            aiGenerateCard
                                .padding(.horizontal, AppSpacing.screenH)

                            // Your Decks section
                            SectionHeader(title: "Your Decks")
                                .padding(.horizontal, AppSpacing.screenH)
                                .padding(.top, 4)

                            // Deck list
                            userDeckList
                                .padding(.horizontal, AppSpacing.screenH)
                        }
                        .padding(.top, 8)
                        .padding(.bottom, 120)
                    }
                }

                // FAB
                FABButton(systemName: "plus") { showNewDeck = true }
                    .shadow(color: AppColor.accent.opacity(0.40), radius: 12, x: 0, y: 8)
                    .shadow(color: .black.opacity(0.12), radius: 3, x: 0, y: 2)
                    .padding(.trailing, AppSpacing.screenH)
                    .padding(.bottom, 8)
            }
            .navigationDestination(isPresented: $navigateToDeck) {
                if let deck = deckForReview {
                    FlashcardReviewView(deck: deck)
                }
            }
            .alert("New Deck", isPresented: $showNewDeck) {
                TextField("Deck name", text: $newDeckName)
                Button("Create") {
                    if !newDeckName.isEmpty {
                        _ = store.createDeck(name: newDeckName)
                        newDeckName = ""
                    }
                }
                Button("Cancel", role: .cancel) { newDeckName = "" }
            }
            .alert("Delete Deck?", isPresented: .init(
                get: { deckToDelete != nil },
                set: { if !$0 { deckToDelete = nil } }
            )) {
                Button("Delete", role: .destructive) {
                    if let d = deckToDelete { store.deleteDeck(deckId: d.deckId) }
                    deckToDelete = nil
                }
                Button("Cancel", role: .cancel) { deckToDelete = nil }
            } message: { Text("All cards in this deck will be deleted.") }
        }
    }

    // MARK: - Auto Deck Card

    private func autoDeckCard(_ deck: FlashcardDeck) -> some View {
        let dueCards = store.dueCardsForDeck(deckId: deck.deckId)
        let total = store.cardsForDeck(deckId: deck.deckId).count

        return CardContainer {
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: AppSpacing.gap) {
                    IconBadge(systemName: "flame.fill", color: AppColor.danger, size: 44)
                    VStack(alignment: .leading, spacing: 4) {
                        PillBadge.tag(text: "AUTO-DECK", fg: AppColor.danger, bg: AppColor.dangerSoft)
                        Text(deck.name)
                            .font(.system(size: 17, weight: .semibold))
                            .kerning(-0.3)
                            .foregroundStyle(AppColor.textPrimary)
                        Text("\(total) \(total == 1 ? "card" : "cards") · \(deck.description ?? "from wrong answers")")
                            .font(.appCaption)
                            .foregroundStyle(AppColor.textMuted)
                    }
                }
                HStack {
                    DueBadge(count: dueCards.count, color: AppColor.danger)
                    Spacer()
                    AccentReviewButton(label: "Review") {
                        deckForReview = deck
                        navigateToDeck = true
                    }
                }
            }
        }
        .contentShape(Rectangle())
        .onTapGesture {
            deckForReview = deck
            navigateToDeck = true
        }
    }

    // MARK: - AI Generate Card

    private var aiGenerateCard: some View {
        Button(action: { showGenerating = true }) {
            HStack(spacing: AppSpacing.gap) {
                IconBadge(systemName: "sparkles", color: AppColor.info, size: 32)
                VStack(alignment: .leading, spacing: 4) {
                    Text("Generate from latest mistakes")
                        .font(.system(size: 14, weight: .semibold))
                        .kerning(-0.1)
                        .foregroundStyle(AppColor.textPrimary)
                    Text("AI creates cards · ~10 sec")
                        .font(.appCaption)
                        .foregroundStyle(AppColor.textMuted)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(AppColor.textMuted)
            }
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(AppColor.surface, in: RoundedRectangle(cornerRadius: AppRadius.card))
            .overlay(
                RoundedRectangle(cornerRadius: AppRadius.card)
                    .strokeBorder(AppColor.border, lineWidth: 0.5)
            )
            .cardShadow()
        }
        .buttonStyle(.plain)
        .disabled(showGenerating)
    }

    // MARK: - User Deck List

    private var userDeckList: some View {
        let userDecks = store.userDecks()
        return Group {
            if userDecks.isEmpty {
                CardContainer {
                    Text("No decks yet. Tap + to create one.")
                        .font(.appCaption)
                        .foregroundStyle(AppColor.textMuted)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 8)
                }
            } else {
                VStack(spacing: 0) {
                    ForEach(Array(userDecks.enumerated()), id: \.element.deckId) { index, deck in
                        DeckListRow(deck: deck, store: store) {
                            deckForReview = deck
                            navigateToDeck = true
                        }
                        .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                            Button(role: .destructive) { deckToDelete = deck } label: {
                                Label("Delete", systemImage: "trash")
                            }
                        }
                        if index < userDecks.count - 1 {
                            Divider()
                                .padding(.leading, 44 + AppSpacing.gap)
                        }
                    }
                }
                .padding(AppSpacing.card)
                .background(AppColor.surface, in: RoundedRectangle(cornerRadius: 12))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .strokeBorder(AppColor.border, lineWidth: 0.5)
                )
                .cardShadowAdaptive()
            }
        }
    }
}

// MARK: - Deck List Row

struct DeckListRow: View {
    let deck: FlashcardDeck
    let store: FlashcardStore
    let onTap: () -> Void

    var body: some View {
        let dueCount = store.dueCardsForDeck(deckId: deck.deckId).count
        let totalCount = store.cardsForDeck(deckId: deck.deckId).count
        let deckColor = AppColor.deckColor(for: deck.deckId)

        return Button(action: onTap) {
            HStack(spacing: AppSpacing.gap) {
                DeckThumb(color: deckColor)

                VStack(alignment: .leading, spacing: 2) {
                    Text(deck.name)
                        .font(.system(size: 15, weight: .medium))
                        .kerning(-0.1)
                        .foregroundStyle(AppColor.textPrimary)
                    Text("\(totalCount) \(totalCount == 1 ? "card" : "cards")")
                        .font(.system(size: 12))
                        .foregroundStyle(AppColor.textMuted)
                }

                Spacer()

                if dueCount > 0 {
                    Text("\(dueCount)")
                        .font(.system(size: 12, weight: .semibold).monospacedDigit())
                        .foregroundStyle(AppColor.accent)
                        .padding(.horizontal, 9)
                        .padding(.vertical, 3)
                        .background(AppColor.accentSoft, in: RoundedRectangle(cornerRadius: 12))
                } else {
                    Text("✓")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(AppColor.success)
                }

                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundStyle(AppColor.textSubtle)
            }
            .padding(.vertical, 6)
        }
        .buttonStyle(.plain)
    }
}
