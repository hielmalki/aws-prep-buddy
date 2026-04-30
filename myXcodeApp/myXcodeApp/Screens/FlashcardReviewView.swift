import SwiftUI

struct FlashcardReviewView: View {
    let deck: FlashcardDeck
    @ObservedObject private var store = FlashcardStore.shared
    @State private var currentIndex = 0
    @State private var isFlipped = false
    @State private var showEdit = false
    @State private var editFront = ""
    @State private var editBack = ""
    @Environment(\.dismiss) private var dismiss

    private var dueCards: [FlashcardItem] {
        store.dueCardsForDeck(deckId: deck.deckId)
    }

    var body: some View {
        Group {
            if dueCards.isEmpty {
                completionView
            } else if currentIndex < dueCards.count {
                reviewBody(card: dueCards[currentIndex])
            } else {
                completionView
            }
        }
        .navigationTitle(deck.name)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Edit") {
                    if currentIndex < dueCards.count {
                        let card = dueCards[currentIndex]
                        editFront = card.front
                        editBack = card.back
                        showEdit = true
                    }
                }
            }
        }
        .sheet(isPresented: $showEdit) {
            editSheet
        }
    }

    @ViewBuilder
    private func reviewBody(card: FlashcardItem) -> some View {
        VStack(spacing: 0) {
            progressBar
            Spacer()
            cardView(card: card)
            Spacer()
            if isFlipped {
                srsButtons(card: card)
            } else {
                showAnswerButton
            }
        }
        .padding()
    }

    private var progressBar: some View {
        HStack {
            Text("\(currentIndex + 1) / \(dueCards.count)")
                .font(.caption)
                .foregroundStyle(.secondary)
            Spacer()
        }
        .padding(.bottom, 8)
    }

    private func cardView(card: FlashcardItem) -> some View {
        ZStack {
            RoundedRectangle(cornerRadius: 20)
                .fill(isFlipped ? Color.accentColor.opacity(0.06) : Color(.secondarySystemBackground))
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .strokeBorder(isFlipped ? Color.accentColor.opacity(0.4) : Color.clear, lineWidth: 2)
                )
                .shadow(color: .black.opacity(0.06), radius: 8, y: 4)

            VStack(spacing: 16) {
                if !card.tags.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
                            ForEach(card.tags, id: \.self) { tag in
                                Text(tag)
                                    .font(.caption2)
                                    .padding(.horizontal, 8).padding(.vertical, 4)
                                    .background(Color.accentColor.opacity(0.1), in: Capsule())
                                    .foregroundStyle(Color.accentColor)
                            }
                        }
                    }
                }
                Text(isFlipped ? card.back : card.front)
                    .font(.title3)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal)
                if !isFlipped {
                    Text("Tap to flip")
                        .font(.caption)
                        .foregroundStyle(.tertiary)
                }
            }
            .padding(24)
        }
        .frame(maxWidth: .infinity)
        .frame(height: 300)
        .onTapGesture { withAnimation(.spring(duration: 0.4)) { isFlipped.toggle() } }
    }

    private var showAnswerButton: some View {
        Button("Show Answer") {
            withAnimation(.spring(duration: 0.4)) { isFlipped = true }
        }
        .buttonStyle(.borderedProminent)
        .padding(.bottom, 20)
    }

    private func srsButtons(card: FlashcardItem) -> some View {
        HStack(spacing: 10) {
            ForEach([ReviewQuality.again, .hard, .good, .easy], id: \.rawValue) { quality in
                Button(action: { reviewCard(card: card, quality: quality) }) {
                    VStack(spacing: 4) {
                        Text(quality.label)
                            .font(.subheadline.bold())
                        Text(previewInterval(card: card, quality: quality))
                            .font(.caption2)
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(qualityColor(quality).opacity(0.15), in: RoundedRectangle(cornerRadius: 12))
                    .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(qualityColor(quality).opacity(0.4), lineWidth: 1))
                }
                .buttonStyle(.plain)
                .foregroundStyle(qualityColor(quality))
            }
        }
        .padding(.bottom, 20)
    }

    private var completionView: some View {
        VStack(spacing: 24) {
            ZStack {
                Circle()
                    .strokeBorder(.green, lineWidth: 4)
                    .frame(width: 100, height: 100)
                Image(systemName: "checkmark")
                    .font(.largeTitle)
                    .foregroundStyle(.green)
            }
            Text("You're all caught up!")
                .font(.title2.bold())
            Text("Come back later for more reviews.")
                .foregroundStyle(.secondary)
            Button("Done") { dismiss() }
                .buttonStyle(.borderedProminent)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private var editSheet: some View {
        NavigationStack {
            Form {
                Section("Front") { TextEditor(text: $editFront).frame(height: 100) }
                Section("Back") { TextEditor(text: $editBack).frame(height: 100) }
            }
            .navigationTitle("Edit Card")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { showEdit = false } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        if currentIndex < dueCards.count {
                            var card = dueCards[currentIndex]
                            card.front = editFront
                            card.back = editBack
                            store.updateCard(card)
                        }
                        showEdit = false
                    }
                }
            }
        }
    }

    private func reviewCard(card: FlashcardItem, quality: ReviewQuality) {
        store.reviewCard(cardId: card.cardId, quality: quality)
        withAnimation {
            currentIndex += 1
            isFlipped = false
        }
    }

    private func qualityColor(_ quality: ReviewQuality) -> Color {
        switch quality {
        case .again: return .red
        case .hard: return .orange
        case .good: return .green
        case .easy: return .blue
        }
    }
}
