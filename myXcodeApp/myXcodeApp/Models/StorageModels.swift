import Foundation

struct AnswerRecord: Codable {
    let examId: Int
    let questionNumber: Int
    let picked: [String]
    let correct: Bool
    let updatedAt: Date
}

struct FlashcardDeck: Codable, Identifiable {
    let deckId: String
    var id: String { deckId }
    var name: String
    var description: String?
    var isAuto: Bool
    let createdAt: Date
    var updatedAt: Date
}

struct FlashcardItem: Codable, Identifiable {
    let cardId: String
    var id: String { cardId }
    var deckId: String
    var front: String
    var back: String
    var tags: [String]
    var source: String?
    // SM-2 fields
    var easeFactor: Double
    var interval: Int
    var repetitions: Int
    var lapses: Int
    var dueAt: Date
    var lastReviewedAt: Date?
}

struct StreakRecord: Codable {
    var lastActivityDate: String  // YYYY-MM-DD
    var currentStreak: Int
    var longestStreak: Int
}

struct TutorMessage: Codable, Identifiable {
    let id: String
    let role: String  // "user" | "assistant"
    var content: String
    let createdAt: Date
}

struct TutorMemory: Codable {
    var goals: String
    var studyFocus: String
    var personalNotes: String
}

struct ExamProgress {
    let examId: Int
    let answered: Int
    let total: Int
    let correct: Int

    var pct: Double { total > 0 ? Double(answered) / Double(total) : 0 }
    var score: Double { answered > 0 ? Double(correct) / Double(answered) : 0 }
    var isComplete: Bool { answered >= total }
}

struct ProgressStats {
    var totalAnswered: Int
    var todayAnswered: Int
    var correctCount: Int
    var avgScore: Double
    var currentStreak: Int
    var longestStreak: Int
}
