import Foundation
import Combine

@MainActor
final class ContentRepository: ObservableObject {
    static let shared = ContentRepository()

    private(set) var exams: [ContentExam] = []
    private(set) var sections: [ContentSection] = []
    private(set) var isLoaded = false

    var allQuestions: [ContentQuestion] { exams.flatMap { $0.questions } }

    private init() {}

    func load() async {
        guard !isLoaded else { return }
        async let examsTask = loadJSON([ContentExam].self, resource: "exams")
        async let sectionsTask = loadJSON([ContentSection].self, resource: "sections")
        let (loadedExams, loadedSections) = await (examsTask, sectionsTask)
        exams = loadedExams ?? []
        sections = loadedSections ?? []
        isLoaded = true
    }

    func exam(id: Int) -> ContentExam? {
        exams.first { $0.examId == id }
    }

    func question(examId: Int, number: Int) -> ContentQuestion? {
        exam(id: examId)?.questions.first { $0.number == number }
    }

    func section(slug: String) -> ContentSection? {
        sections.first { $0.slug == slug }
    }

    private func loadJSON<T: Decodable>(_ type: T.Type, resource: String) async -> T? {
        return await Task.detached(priority: .userInitiated) {
            guard let url = Bundle.main.url(forResource: resource, withExtension: "json") else {
                print("ContentRepository: \(resource).json not found in bundle")
                return nil
            }
            do {
                let data = try Data(contentsOf: url)
                let decoder = JSONDecoder()
                return try decoder.decode(T.self, from: data)
            } catch {
                print("ContentRepository: failed to decode \(resource).json — \(error)")
                return nil
            }
        }.value
    }
}
