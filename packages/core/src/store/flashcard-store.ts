import { create } from 'zustand';
import { getStorageAdapter } from './adapter.js';

function uuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return uuid();
  }
  // Fallback for iOS Safari < 15.4 and non-secure contexts
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
import { applyReview } from '../srs.js';
import type { ReviewQuality } from '../srs.js';
import type { FlashcardDeckRecord, FlashcardRecord } from './schema.js';

export type { ReviewQuality };

interface FlashcardState {
  userId: string;
  decks: Record<string, FlashcardDeckRecord>;
  cards: Record<string, FlashcardRecord>;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  ensureMistakesDeck: () => Promise<FlashcardDeckRecord>;
  ensureTopicDeck: (slug: string, name: string) => Promise<FlashcardDeckRecord>;
  createDeck: (name: string, description?: string) => Promise<FlashcardDeckRecord>;
  updateDeck: (deckId: string, patch: Partial<Pick<FlashcardDeckRecord, 'name' | 'description'>>) => Promise<void>;
  deleteDeck: (deckId: string) => Promise<void>;
  addCard: (input: {
    deckId: string;
    front: string;
    back: string;
    tags?: string[];
    source?: FlashcardRecord['source'];
  }) => Promise<FlashcardRecord>;
  updateCard: (cardId: string, patch: Partial<Pick<FlashcardRecord, 'front' | 'back' | 'tags' | 'deckId'>>) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  reviewCard: (cardId: string, quality: ReviewQuality) => Promise<void>;
}

export const useFlashcardStore = create<FlashcardState>((set, get) => ({
  userId: 'local',
  decks: {},
  cards: {},
  hydrated: false,

  hydrate: async () => {
    const { userId } = get();
    const [deckList, cardList] = await Promise.all([
      getStorageAdapter().list<FlashcardDeckRecord>('flashcardDecks', { userId }),
      getStorageAdapter().list<FlashcardRecord>('flashcards', { userId }),
    ]);
    const decks = Object.fromEntries(deckList.map(d => [d.deckId, d]));
    const cards = Object.fromEntries(cardList.map(c => [c.cardId, c]));
    set({ decks, cards, hydrated: true });
  },

  ensureMistakesDeck: async () => {
    const { userId, decks } = get();
    if (decks['mistakes']) return decks['mistakes'];
    const now = Date.now();
    const deck: FlashcardDeckRecord = {
      userId,
      deckId: 'mistakes',
      name: 'My Mistakes',
      isAuto: true,
      createdAt: now,
      updatedAt: now,
    };
    const next = { ...decks, mistakes: deck };
    set({ decks: next });
    await getStorageAdapter().put('flashcardDecks', `${userId}:mistakes`, deck);
    return deck;
  },

  ensureTopicDeck: async (slug, name) => {
    const id = `topic:${slug}`;
    const { userId, decks } = get();
    if (decks[id]) return decks[id];
    const now = Date.now();
    const deck: FlashcardDeckRecord = { userId, deckId: id, name, isAuto: false, createdAt: now, updatedAt: now };
    set({ decks: { ...decks, [id]: deck } });
    await getStorageAdapter().put('flashcardDecks', `${userId}:${id}`, deck);
    return deck;
  },

  createDeck: async (name, description) => {
    const { userId, decks } = get();
    const now = Date.now();
    const deckId = uuid();
    const deck: FlashcardDeckRecord = { userId, deckId, name, description, isAuto: false, createdAt: now, updatedAt: now };
    const next = { ...decks, [deckId]: deck };
    set({ decks: next });
    await getStorageAdapter().put('flashcardDecks', `${userId}:${deckId}`, deck);
    return deck;
  },

  updateDeck: async (deckId, patch) => {
    const { userId, decks } = get();
    const existing = decks[deckId];
    if (!existing) return;
    const updated: FlashcardDeckRecord = { ...existing, ...patch, updatedAt: Date.now() };
    set({ decks: { ...decks, [deckId]: updated } });
    await getStorageAdapter().put('flashcardDecks', `${userId}:${deckId}`, updated);
  },

  deleteDeck: async (deckId) => {
    const { userId, decks, cards } = get();
    const nextDecks = { ...decks };
    delete nextDecks[deckId];
    const nextCards = { ...cards };
    const cardsToDrop = Object.values(cards).filter(c => c.deckId === deckId);
    for (const c of cardsToDrop) {
      delete nextCards[c.cardId];
    }
    set({ decks: nextDecks, cards: nextCards });
    await getStorageAdapter().delete('flashcardDecks', `${userId}:${deckId}`);
    await Promise.all(cardsToDrop.map(c => getStorageAdapter().delete('flashcards', `${userId}:${c.cardId}`)));
  },

  addCard: async ({ deckId, front, back, tags = [], source }) => {
    const { userId, cards } = get();
    const now = Date.now();
    const cardId = uuid();
    const card: FlashcardRecord = {
      userId,
      cardId,
      deckId,
      front,
      back,
      tags,
      source,
      easeFactor: 2.5,
      interval: 0,
      repetitions: 0,
      lapses: 0,
      dueAt: now,
      lastReviewedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    const next = { ...cards, [cardId]: card };
    set({ cards: next });
    await getStorageAdapter().put('flashcards', `${userId}:${cardId}`, card);
    return card;
  },

  updateCard: async (cardId, patch) => {
    const { userId, cards } = get();
    const existing = cards[cardId];
    if (!existing) return;
    const updated: FlashcardRecord = { ...existing, ...patch, updatedAt: Date.now() };
    const next = { ...cards, [cardId]: updated };
    set({ cards: next });
    await getStorageAdapter().put('flashcards', `${userId}:${cardId}`, updated);
  },

  deleteCard: async (cardId) => {
    const { userId, cards } = get();
    const next = { ...cards };
    delete next[cardId];
    set({ cards: next });
    await getStorageAdapter().delete('flashcards', `${userId}:${cardId}`);
  },

  reviewCard: async (cardId, quality) => {
    const { userId, cards } = get();
    const existing = cards[cardId];
    if (!existing) return;
    const sm2 = applyReview(existing, quality);
    const updated: FlashcardRecord = { ...existing, ...sm2, updatedAt: Date.now() };
    const next = { ...cards, [cardId]: updated };
    set({ cards: next });
    await getStorageAdapter().put('flashcards', `${userId}:${cardId}`, updated);
  },
}));

export function dueCardsForDeck(
  cards: Record<string, FlashcardRecord>,
  deckId: string,
  now = Date.now(),
): FlashcardRecord[] {
  return Object.values(cards).filter(c => c.deckId === deckId && c.dueAt <= now);
}

export function totalCardsForDeck(
  cards: Record<string, FlashcardRecord>,
  deckId: string,
): number {
  return Object.values(cards).filter(c => c.deckId === deckId).length;
}
