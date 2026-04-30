import Foundation
import Combine

@MainActor
final class StreakStore: ObservableObject {
    static let shared = StreakStore()
    private let storage = StorageService.shared
    private let table = "streak"
    private let key = "user"

    @Published private(set) var currentStreak: Int = 0
    @Published private(set) var longestStreak: Int = 0
    @Published private(set) var lastActivityDate: String = ""

    private init() { load() }

    private func load() {
        if let r = storage.get(StreakRecord.self, table: table, key: key) {
            currentStreak = r.currentStreak
            longestStreak = r.longestStreak
            lastActivityDate = r.lastActivityDate
        }
    }

    func recordActivity() {
        let today = todayString()
        if lastActivityDate == today { return }

        let yesterday = yesterdayString()
        if lastActivityDate == yesterday {
            currentStreak += 1
        } else if lastActivityDate != today {
            currentStreak = 1
        }
        longestStreak = max(longestStreak, currentStreak)
        lastActivityDate = today
        save()
    }

    private func save() {
        storage.put(
            StreakRecord(lastActivityDate: lastActivityDate, currentStreak: currentStreak, longestStreak: longestStreak),
            table: table, key: key
        )
    }

    private func todayString() -> String { dateString(for: Date()) }
    private func yesterdayString() -> String {
        dateString(for: Calendar.current.date(byAdding: .day, value: -1, to: Date()) ?? Date())
    }
    private func dateString(for date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }
}
