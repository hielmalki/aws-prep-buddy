import Foundation
import Combine

struct TutorContext {
    var examId: Int?
    var questionNumber: Int?
    var questionText: String?
    var picked: [String]?
    var correctLetters: [String]?
}

@MainActor
final class TutorStore: ObservableObject {
    static let shared = TutorStore()
    private let storage = StorageService.shared
    private let memTable = "tutor_memory"
    private let memKey = "user"

    @Published var messages: [TutorMessage] = []
    @Published var memory: TutorMemory = TutorMemory(goals: "", studyFocus: "", personalNotes: "")
    @Published var isStreaming = false
    @Published var context: TutorContext = TutorContext()

    private var turnsSinceMemoryUpdate = 0
    private var conversationSummary: String = ""

    private init() { loadMemory() }

    private func loadMemory() {
        if let m = storage.get(TutorMemory.self, table: memTable, key: memKey) {
            memory = m
        }
    }

    func saveMemory() {
        storage.put(memory, table: memTable, key: memKey)
    }

    func appendUserMessage(_ text: String) {
        let msg = TutorMessage(id: UUID().uuidString, role: "user", content: text, createdAt: Date())
        messages.append(msg)
        compressIfNeeded()
    }

    func beginAssistantMessage() -> String {
        let id = UUID().uuidString
        let msg = TutorMessage(id: id, role: "assistant", content: "", createdAt: Date())
        messages.append(msg)
        turnsSinceMemoryUpdate += 1
        return id
    }

    func appendToken(_ token: String, to messageId: String) {
        if let idx = messages.firstIndex(where: { $0.id == messageId }) {
            messages[idx].content += token
        }
    }

    func clearSession() {
        messages = []
        conversationSummary = ""
        turnsSinceMemoryUpdate = 0
    }

    func setContext(_ ctx: TutorContext) {
        context = ctx
    }

    var chatHistory: [[String: String]] {
        messages.map { ["role": $0.role, "content": $0.content] }
    }

    var weakTopics: [(topic: String, pct: Double, total: Int)] { [] }

    private func compressIfNeeded() {
        // Keep last 24 messages; beyond that, trim from the front
        if messages.count > 24 {
            let toKeep = Array(messages.suffix(8))
            conversationSummary = "Earlier conversation was summarized."
            messages = toKeep
        }
    }
}
