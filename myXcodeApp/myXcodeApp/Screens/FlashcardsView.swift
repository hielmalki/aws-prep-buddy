import SwiftUI

struct FlashcardsView: View {
    @ObservedObject private var store = FlashcardStore.shared
    @State private var showNewDeck = false
    @State private var newDeckName = ""
    @State private var deckToDelete: FlashcardDeck?
    @State private var showGenerating = false

    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottomTrailing) {
                AppColor.screen.ignoresSafeArea()

                ScrollView(showsIndicators: false) {
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

                        // Deck list using List for swipe support
                        userDeckList
                            .padding(.horizontal, AppSpacing.screenH)
                    }
                    .padding(.top, 8)
                    .padding(.bottom, 120)
                }

                // FAB
                FABButton(systemName: "plus") { showNewDeck = true }
                    .padding(.trailing, AppSpacing.screenH)
                    .padding(.bottom, 8)
            }
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Review")
                            .badgeText()
                            .foregroundStyle(AppColor.textMuted)
                        Text("Flashcards")
                            .mainTitle()
                            .foregroundStyle(AppColor.textPrimary)
                    }
                    .padding(.top, 4)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    let totalDue = store.totalDueCount
                    let totalDecks = store.decks.count
                    if totalDecks > 0 {
                        Text("\(totalDue > 0 ? "\(totalDue) due" : "0 due") · \(totalDecks) decks")
                            .font(.appBody)
                            .foregroundStyle(AppColor.accent)
                    }
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
        return NavigationLink(destination: FlashcardReviewView(deck: deck)) {
            CardContainer {
                VStack(alignment: .leading, spacing: 12) {
                    HStack(spacing: AppSpacing.gap) {
                        IconBadge(systemName: "flame.fill", color: AppColor.danger, size: 48)
                        VStack(alignment: .leading, spacing: 4) {
                            PillBadge(text: "AUTO-DECK", fg: AppColor.danger, bg: AppColor.dangerSoft)
                            Text(deck.name)
                                .cardTitle()
                                .foregroundStyle(AppColor.textPrimary)
                            Text("\(total) cards · \(deck.description ?? "from wrong answers")")
                                .captionText()
                                .foregroundStyle(AppColor.textMuted)
                        }
                    }
                    HStack {
                        DueBadge(count: dueCards.count, color: AppColor.danger)
                        Spacer()
                        HStack(spacing: 6) {
                            Text("Review")
                                .font(.appBody)
                                .foregroundStyle(AppColor.accent)
                            Image(systemName: "chevron.right")
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundStyle(AppColor.accent)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(AppColor.accentSoft, in: Capsule())
                    }
                }
            }
        }
        .buttonStyle(.plain)
    }

    // MARK: - AI Generate Card

    private var aiGenerateCard: some View {
        Button(action: { showGenerating = true }) {
            CardContainer {
                HStack(spacing: AppSpacing.gap) {
                    IconBadge(systemName: "sparkles", color: AppColor.info, size: 44)
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Generate from latest mistakes")
                            .cardTitle()
                            .foregroundStyle(AppColor.textPrimary)
                        Text("AI creates cards · ~10 sec")
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
        .disabled(showGenerating)
    }

    // MARK: - User Deck List

    private var userDeckList: some View {
        let userDecks = store.userDecks()
        return Group {
            if userDecks.isEmpty {
                CardContainer {
                    Text("No decks yet. Tap + to create one.")
                        .captionText()
                        .foregroundStyle(AppColor.textMuted)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 8)
                }
            } else {
                // White card container wrapping the list
                VStack(spacing: 0) {
                    ForEach(Array(userDecks.enumerated()), id: \.element.deckId) { index, deck in
                        NavigationLink(destination: FlashcardReviewView(deck: deck)) {
                            DeckListRow(deck: deck, store: store)
                        }
                        .buttonStyle(.plain)
                        .swipeActions(edge: .trailing, allowsFullSwipe: false) {
                            Button(role: .destructive) { deckToDelete = deck } label: {
                                Label("Delete", systemImage: "trash")
                            }
                        }
                        if index < userDecks.count - 1 {
                            Divider()
                                .padding(.leading, 60 + AppSpacing.gap)
                        }
                    }
                }
                .padding(AppSpacing.card)
                .background(AppColor.surface, in: RoundedRectangle(cornerRadius: AppRadius.card))
                .overlay(RoundedRectangle(cornerRadius: AppRadius.card).strokeBorder(AppColor.border, lineWidth: 0.5))
                .cardShadow()
            }
        }
    }
}

// MARK: - Deck List Row

struct DeckListRow: View {
    let deck: FlashcardDeck
    let store: FlashcardStore

    var body: some View {
        let dueCount = store.dueCardsForDeck(deckId: deck.deckId).count
        let totalCount = store.cardsForDeck(deckId: deck.deckId).count
        let deckColor = AppColor.deckColor(for: deck.deckId)

        HStack(spacing: AppSpacing.gap) {
            IconBadge(systemName: "rectangle.stack.fill", color: deckColor, size: 40)
            VStack(alignment: .leading, spacing: 2) {
                Text(deck.name)
                    .cardTitle()
                    .foregroundStyle(AppColor.textPrimary)
                Text("\(totalCount) \(totalCount == 1 ? "card" : "cards")")
                    .captionText()
                    .foregroundStyle(AppColor.textMuted)
            }
            Spacer()
            if dueCount > 0 {
                RoundedBadge(count: dueCount, color: AppColor.accent)
            }
            Image(systemName: "chevron.right")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(AppColor.textMuted)
        }
        .padding(.vertical, 6)
    }
}
