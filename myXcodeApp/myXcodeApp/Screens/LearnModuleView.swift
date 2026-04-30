import SwiftUI

struct LearnModuleView: View {
    let section: ContentSection
    @ObservedObject private var content = ContentRepository.shared
    @State private var showQuiz = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header
                VStack(alignment: .leading, spacing: 8) {
                    Text(section.title)
                        .font(.largeTitle.bold())
                    topicsRow
                }
                .padding(.horizontal)

                Divider()

                // Markdown content
                MarkdownView(text: section.body)
                    .padding(.horizontal)

                // Quiz CTA
                quizCTA
                    .padding(.horizontal)
            }
            .padding(.vertical)
            .padding(.bottom, 80)
        }
        .navigationTitle(section.title)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showQuiz) {
            if let exam = content.exams.first {
                NavigationStack {
                    let topicQuestions = content.allQuestions.filter { q in
                        q.topics.contains(where: { section.topics.contains($0) })
                    }.shuffled().prefix(10)
                    QuizView(
                        exam: ContentExam(examId: exam.examId, questions: Array(topicQuestions)),
                        startFromFirst: true
                    )
                }
            }
        }
    }

    private var topicsRow: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                ForEach(section.topics, id: \.self) { topic in
                    Text(topic)
                        .font(.caption)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(Color.accentColor.opacity(0.1), in: Capsule())
                        .foregroundStyle(Color.accentColor)
                }
            }
        }
    }

    private var quizCTA: some View {
        Button(action: { showQuiz = true }) {
            Label("Quiz yourself on \(section.title)", systemImage: "questionmark.circle.fill")
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.borderedProminent)
    }
}

// MARK: - Minimal Markdown Renderer

struct MarkdownView: View {
    let text: String

    var body: some View {
        let blocks = parseMarkdown(text)
        VStack(alignment: .leading, spacing: 12) {
            ForEach(Array(blocks.enumerated()), id: \.offset) { _, block in
                blockView(block)
            }
        }
    }

    @ViewBuilder
    private func blockView(_ block: MarkdownBlock) -> some View {
        switch block {
        case .h1(let t):
            Text(t).font(.title.bold()).fixedSize(horizontal: false, vertical: true)
        case .h2(let t):
            Text(t).font(.title2.bold()).fixedSize(horizontal: false, vertical: true)
        case .h3(let t):
            Text(t).font(.title3.bold()).fixedSize(horizontal: false, vertical: true)
        case .paragraph(let t):
            Text(LocalizedStringKey(t)).font(.body).fixedSize(horizontal: false, vertical: true)
        case .bullet(let t):
            HStack(alignment: .top, spacing: 8) {
                Text("•").foregroundStyle(.secondary)
                Text(t).font(.body).fixedSize(horizontal: false, vertical: true)
            }
        case .code(let t):
            Text(t)
                .font(.system(.caption, design: .monospaced))
                .padding(12)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(.systemGray6), in: RoundedRectangle(cornerRadius: 8))
        case .callout(let t):
            HStack(alignment: .top, spacing: 10) {
                Rectangle()
                    .fill(Color.accentColor)
                    .frame(width: 3)
                    .frame(maxHeight: .infinity)
                Text(t).font(.body).fixedSize(horizontal: false, vertical: true)
            }
            .padding(12)
            .background(Color.accentColor.opacity(0.06), in: RoundedRectangle(cornerRadius: 8))
        }
    }
}

enum MarkdownBlock {
    case h1(String)
    case h2(String)
    case h3(String)
    case paragraph(String)
    case bullet(String)
    case code(String)
    case callout(String)
}

private func parseMarkdown(_ text: String) -> [MarkdownBlock] {
    var blocks: [MarkdownBlock] = []
    var inCodeBlock = false
    var codeLines: [String] = []

    for line in text.components(separatedBy: "\n") {
        if line.hasPrefix("```") {
            if inCodeBlock {
                blocks.append(.code(codeLines.joined(separator: "\n")))
                codeLines = []
                inCodeBlock = false
            } else {
                inCodeBlock = true
            }
            continue
        }
        if inCodeBlock { codeLines.append(line); continue }

        if line.hasPrefix("### ") { blocks.append(.h3(String(line.dropFirst(4)))); continue }
        if line.hasPrefix("## ") { blocks.append(.h2(String(line.dropFirst(3)))); continue }
        if line.hasPrefix("# ") { blocks.append(.h1(String(line.dropFirst(2)))); continue }
        if line.hasPrefix("- ") || line.hasPrefix("* ") { blocks.append(.bullet(String(line.dropFirst(2)))); continue }
        if line.hasPrefix("> ") { blocks.append(.callout(String(line.dropFirst(2)))); continue }
        if line.trimmingCharacters(in: .whitespaces).isEmpty { continue }
        blocks.append(.paragraph(line))
    }
    return blocks
}
