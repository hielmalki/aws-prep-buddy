import Foundation
import Combine

@MainActor
final class FlashcardStore: ObservableObject {
    static let shared = FlashcardStore()
    private let storage = StorageService.shared
    private let deckTable = "decks"
    private let cardTable = "cards"

    @Published private(set) var decks: [String: FlashcardDeck] = [:]
    @Published private(set) var cards: [String: FlashcardItem] = [:]

    private init() { load() }

    private func load() {
        let allDecks = storage.list(FlashcardDeck.self, table: deckTable)
        decks = Dictionary(uniqueKeysWithValues: allDecks.map { ($0.deckId, $0) })
        let allCards = storage.list(FlashcardItem.self, table: cardTable)
        cards = Dictionary(uniqueKeysWithValues: allCards.map { ($0.cardId, $0) })
    }

    // MARK: - Decks

    func createDeck(name: String, description: String? = nil, isAuto: Bool = false, deckId: String? = nil) -> FlashcardDeck {
        let id = deckId ?? UUID().uuidString
        let deck = FlashcardDeck(deckId: id, name: name, description: description, isAuto: isAuto, createdAt: Date(), updatedAt: Date())
        decks[id] = deck
        storage.put(deck, table: deckTable, key: id)
        return deck
    }

    func deleteDeck(deckId: String) {
        decks.removeValue(forKey: deckId)
        storage.delete(table: deckTable, key: deckId)
        let deckCards = cards.values.filter { $0.deckId == deckId }
        for card in deckCards {
            cards.removeValue(forKey: card.cardId)
            storage.delete(table: cardTable, key: card.cardId)
        }
    }

    func userDecks() -> [FlashcardDeck] {
        decks.values.filter { !$0.isAuto }.sorted { $0.createdAt < $1.createdAt }
    }

    func autoDecks() -> [FlashcardDeck] {
        decks.values.filter { $0.isAuto }.sorted { $0.name < $1.name }
    }

    // MARK: - Cards

    func addCard(deckId: String, front: String, back: String, tags: [String] = [], source: String? = nil) -> FlashcardItem {
        let id = UUID().uuidString
        let card = FlashcardItem(
            cardId: id, deckId: deckId, front: front, back: back, tags: tags, source: source,
            easeFactor: 2.5, interval: 0, repetitions: 0, lapses: 0, dueAt: Date(), lastReviewedAt: nil
        )
        cards[id] = card
        storage.put(card, table: cardTable, key: id)
        return card
    }

    func updateCard(_ card: FlashcardItem) {
        cards[card.cardId] = card
        storage.put(card, table: cardTable, key: card.cardId)
    }

    func deleteCard(cardId: String) {
        cards.removeValue(forKey: cardId)
        storage.delete(table: cardTable, key: cardId)
    }

    func cardsForDeck(deckId: String) -> [FlashcardItem] {
        cards.values.filter { $0.deckId == deckId }.sorted { $0.cardId < $1.cardId }
    }

    func dueCardsForDeck(deckId: String) -> [FlashcardItem] {
        cardsForDeck(deckId: deckId).filter { isDue($0) }
    }

    // MARK: - Review

    func reviewCard(cardId: String, quality: ReviewQuality) {
        guard let card = cards[cardId] else { return }
        let updated = applyReview(card: card, quality: quality)
        updateCard(updated)
    }

    // MARK: - Auto-deck helpers

    func ensureMistakesDeck() -> FlashcardDeck {
        if let d = decks["mistakes"] { return d }
        return createDeck(name: "My Mistakes", description: "Wrong quiz answers", isAuto: true, deckId: "mistakes")
    }

    func addMistakeCard(question: ContentQuestion, picked: [String]) {
        let deck = ensureMistakesDeck()
        let correct = question.correctLetters.joined(separator: ", ")
        let pickedStr = picked.joined(separator: ", ")
        let front = question.text
        let back = "Correct: \(correct)\nYou picked: \(pickedStr)\n\n\(question.explanation ?? "")"
        addCard(deckId: deck.deckId, front: front, back: back, tags: question.topics, source: "quiz")
    }

    func addAICards(deckId: String, pairs: [(front: String, back: String)]) {
        for pair in pairs {
            _ = addCard(deckId: deckId, front: pair.front, back: pair.back)
        }
    }

    var totalDueCount: Int {
        cards.values.filter { isDue($0) }.count
    }
}
