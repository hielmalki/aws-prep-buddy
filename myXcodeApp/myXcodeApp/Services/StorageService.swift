import Foundation

final class StorageService {
    static let shared = StorageService()
    private let defaults = UserDefaults.standard
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()
    private init() {
        encoder.dateEncodingStrategy = .iso8601
        decoder.dateDecodingStrategy = .iso8601
    }

    func get<T: Decodable>(_ type: T.Type, table: String, key: String) -> T? {
        let k = storageKey(table: table, key: key)
        guard let data = defaults.data(forKey: k) else { return nil }
        return try? decoder.decode(T.self, from: data)
    }

    func put<T: Encodable>(_ value: T, table: String, key: String) {
        let k = storageKey(table: table, key: key)
        if let data = try? encoder.encode(value) {
            defaults.set(data, forKey: k)
        }
    }

    func delete(table: String, key: String) {
        defaults.removeObject(forKey: storageKey(table: table, key: key))
    }

    func list<T: Decodable>(_ type: T.Type, table: String) -> [T] {
        let prefix = "\(table):"
        return defaults.dictionaryRepresentation().keys
            .filter { $0.hasPrefix(prefix) }
            .compactMap { k -> T? in
                guard let data = defaults.data(forKey: k) else { return nil }
                return try? decoder.decode(T.self, from: data)
            }
    }

    func clearTable(_ table: String) {
        let prefix = "\(table):"
        defaults.dictionaryRepresentation().keys
            .filter { $0.hasPrefix(prefix) }
            .forEach { defaults.removeObject(forKey: $0) }
    }

    private func storageKey(table: String, key: String) -> String {
        "\(table):\(key)"
    }
}
