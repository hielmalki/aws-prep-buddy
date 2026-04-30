import SwiftUI

struct TutorSheet: View {
    let context: TutorContext
    @StateObject private var store = TutorStore.shared
    @ObservedObject private var settings = SettingsStore.shared
    @State private var inputText = ""
    @State private var error: String?
    @Environment(\.dismiss) private var dismiss

    private let quickPrompts = [
        "Explain simpler",
        "Give an example",
        "Why is this wrong?",
        "Memory trick?"
    ]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                if settings.openAIKey.isEmpty {
                    noKeyBanner
                } else {
                    quickChips
                    Divider()
                    chatArea
                    Divider()
                    inputBar
                }
            }
            .navigationTitle("AI Tutor")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Done") { dismiss() }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: { store.clearSession() }) {
                        Image(systemName: "trash")
                    }
                    .disabled(store.messages.isEmpty)
                }
            }
            .onAppear { store.setContext(context) }
        }
    }

    private var noKeyBanner: some View {
        VStack(spacing: 16) {
            Image(systemName: "key.slash").font(.largeTitle).foregroundStyle(.orange)
            Text("OpenAI API key not set")
                .font(.headline)
            Text("Add your API key in Settings to use the AI Tutor.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var quickChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(quickPrompts, id: \.self) { prompt in
                    Button(action: { sendMessage(prompt) }) {
                        Text(prompt)
                            .font(.caption)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(Color(.secondarySystemBackground), in: Capsule())
                    }
                    .buttonStyle(.plain)
                    .disabled(store.isStreaming)
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
        }
    }

    private var chatArea: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 12) {
                    ForEach(store.messages) { msg in
                        ChatBubble(message: msg)
                            .id(msg.id)
                    }
                    if let error = error {
                        Text(error)
                            .font(.caption)
                            .foregroundStyle(.red)
                            .padding(.horizontal)
                    }
                }
                .padding()
            }
            .onChange(of: store.messages.count) { _, _ in
                if let last = store.messages.last {
                    withAnimation { proxy.scrollTo(last.id, anchor: .bottom) }
                }
            }
        }
    }

    private var inputBar: some View {
        HStack(spacing: 10) {
            TextField("Ask anything…", text: $inputText, axis: .vertical)
                .lineLimit(1...4)
                .padding(10)
                .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 20))
                .disabled(store.isStreaming)

            Button(action: { sendMessage(inputText) }) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.title2)
                    .foregroundStyle(inputText.isEmpty || store.isStreaming ? Color.secondary : Color.accentColor)
            }
            .disabled(inputText.isEmpty || store.isStreaming)
        }
        .padding(.horizontal)
        .padding(.vertical, 10)
    }

    private func sendMessage(_ text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty, !store.isStreaming else { return }
        inputText = ""
        error = nil

        store.appendUserMessage(trimmed)
        store.isStreaming = true
        let msgId = store.beginAssistantMessage()

        Task {
            let request = TutorRequest(
                messages: store.messages.filter { $0.role == "user" || $0.id != msgId },
                context: store.context,
                memory: store.memory,
                conversationSummary: nil,
                apiKey: settings.openAIKey
            )
            do {
                for try await token in TutorClient.shared.stream(request: request) {
                    await MainActor.run { store.appendToken(token, to: msgId) }
                }
            } catch {
                await MainActor.run { self.error = error.localizedDescription }
            }
            await MainActor.run { store.isStreaming = false }
        }
    }
}

struct ChatBubble: View {
    let message: TutorMessage

    var isUser: Bool { message.role == "user" }

    var body: some View {
        HStack {
            if isUser { Spacer(minLength: 40) }
            Text(message.content.isEmpty ? "…" : message.content)
                .font(.body)
                .padding(12)
                .background(
                    isUser ? Color.accentColor : Color(.secondarySystemBackground),
                    in: RoundedRectangle(cornerRadius: 16)
                )
                .foregroundStyle(isUser ? .white : .primary)
            if !isUser { Spacer(minLength: 40) }
        }
    }
}
