import Foundation

struct ContentOption: Codable, Hashable {
    let letter: String
    let text: String
}

struct ContentQuestion: Codable, Identifiable {
    var id: String { "\(examId)-\(number)" }
    let examId: Int
    let number: Int
    let text: String
    let options: [ContentOption]
    let correctLetters: [String]
    let explanation: String?
    let topics: [String]
}

struct ContentExam: Codable, Identifiable {
    var id: Int { examId }
    let examId: Int
    let questions: [ContentQuestion]
}

struct ContentSection: Codable, Identifiable {
    var id: String { slug }
    let slug: String
    let title: String
    let body: String
    let topics: [String]
}
