import Foundation

struct OpenAIChatMessage: Codable {
    let role: String
    let content: String
}

struct TutorRequest {
    var messages: [TutorMessage]
    var context: TutorContext?
    var memory: TutorMemory?
    var conversationSummary: String?
    var apiKey: String
}

final class TutorClient {
    static let shared = TutorClient()
    private init() {}

    private let endpoint = URL(string: "https://api.openai.com/v1/chat/completions")!
    private let model = "gpt-4o-mini"

    func stream(request: TutorRequest) -> AsyncThrowingStream<String, Error> {
        AsyncThrowingStream { continuation in
            Task {
                do {
                    let urlRequest = try buildRequest(request)
                    let (bytes, response) = try await URLSession.shared.bytes(for: urlRequest)

                    guard let httpResponse = response as? HTTPURLResponse,
                          (200...299).contains(httpResponse.statusCode) else {
                        throw TutorError.httpError((response as? HTTPURLResponse)?.statusCode ?? -1)
                    }

                    for try await line in bytes.lines {
                        guard line.hasPrefix("data: ") else { continue }
                        let json = String(line.dropFirst(6))
                        if json == "[DONE]" { break }
                        guard let data = json.data(using: .utf8),
                              let chunk = try? JSONDecoder().decode(StreamChunk.self, from: data),
                              let token = chunk.choices.first?.delta.content else { continue }
                        continuation.yield(token)
                    }
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
        }
    }

    private func buildRequest(_ req: TutorRequest) throws -> URLRequest {
        var urlRequest = URLRequest(url: endpoint)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("Bearer \(req.apiKey)", forHTTPHeaderField: "Authorization")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let systemPrompt = buildSystemPrompt(req)
        var chatMessages: [[String: String]] = [["role": "system", "content": systemPrompt]]
        chatMessages += req.messages.map { ["role": $0.role, "content": $0.content] }

        let body: [String: Any] = [
            "model": model,
            "messages": chatMessages,
            "stream": true,
            "max_tokens": 512
        ]
        urlRequest.httpBody = try JSONSerialization.data(withJSONObject: body)
        return urlRequest
    }

    private func buildSystemPrompt(_ req: TutorRequest) -> String {
        var prompt = """
        You are an expert AWS Cloud Practitioner (CLF-C02) tutor. Help the student understand concepts, explain answers, and provide memory tricks. Be concise and friendly.
        """
        if let memory = req.memory, !memory.goals.isEmpty {
            prompt += "\n\nStudent goals: \(memory.goals)"
        }
        if let ctx = req.context, let qText = ctx.questionText {
            prompt += "\n\nCurrent question: \(qText)"
            if let picked = ctx.picked {
                prompt += "\nStudent answered: \(picked.joined(separator: ", "))"
            }
            if let correct = ctx.correctLetters {
                prompt += "\nCorrect answer: \(correct.joined(separator: ", "))"
            }
        }
        if let summary = req.conversationSummary, !summary.isEmpty {
            prompt += "\n\nConversation summary: \(summary)"
        }
        return prompt
    }

    // MARK: - Response types
    private struct StreamChunk: Decodable {
        let choices: [Choice]
        struct Choice: Decodable {
            let delta: Delta
            struct Delta: Decodable {
                let content: String?
            }
        }
    }
}

enum TutorError: LocalizedError {
    case httpError(Int)
    case noAPIKey

    var errorDescription: String? {
        switch self {
        case .httpError(let code): return "API error: HTTP \(code)"
        case .noAPIKey: return "OpenAI API key not set. Add it in Settings."
        }
    }
}
