import Foundation

enum ReviewQuality: Int {
    case again = 0
    case hard = 1
    case good = 3
    case easy = 4

    var label: String {
        switch self {
        case .again: return "Again"
        case .hard: return "Hard"
        case .good: return "Good"
        case .easy: return "Easy"
        }
    }

    var color: String {
        switch self {
        case .again: return "red"
        case .hard: return "yellow"
        case .good: return "green"
        case .easy: return "blue"
        }
    }
}

func previewInterval(card: FlashcardItem, quality: ReviewQuality) -> String {
    let updated = applyReview(card: card, quality: quality)
    let days = updated.interval
    if days == 0 { return "1 min" }
    if days == 1 { return "1 day" }
    return "\(days) days"
}

func applyReview(card: FlashcardItem, quality: ReviewQuality) -> FlashcardItem {
    var c = card
    let q = quality.rawValue
    let now = Date()

    // Update ease factor
    var ef = c.easeFactor + (0.1 - Double(5 - q) * (0.08 + Double(5 - q) * 0.02))
    ef = max(1.3, ef)
    c.easeFactor = ef

    if q < 3 {
        // Failed — reset repetitions
        c.lapses += 1
        c.repetitions = 0
        c.interval = 0
        c.dueAt = now  // review again immediately (in a real app: +1 min)
    } else {
        // Passed
        if c.repetitions == 0 {
            c.interval = 1
        } else if c.repetitions == 1 {
            c.interval = 3
        } else {
            c.interval = Int(Double(c.interval) * ef)
        }
        c.repetitions += 1
        c.dueAt = Calendar.current.date(byAdding: .day, value: c.interval, to: now) ?? now
    }

    c.lastReviewedAt = now
    return c
}

func isDue(_ card: FlashcardItem) -> Bool {
    card.dueAt <= Date()
}
