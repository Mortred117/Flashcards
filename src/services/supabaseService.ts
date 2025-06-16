import { supabase } from '../lib/supabase';
import { Deck, Flashcard } from '../types';

// ID do usuário temporário (será substituído por autenticação real)
const TEMP_USER_ID = 'temp-user';

export class SupabaseService {
  // ===== DECKS =====
  
  // Buscar todos os decks do usuário
  static async getDecks(): Promise<Deck[]> {
    try {
      const { data: decksData, error: decksError } = await supabase
        .from('decks')
        .select('*')
        .eq('user_id', TEMP_USER_ID)
        .order('created_at', { ascending: false });

      if (decksError) throw decksError;

      if (!decksData || decksData.length === 0) {
        return [];
      }

      // Buscar cards para cada deck
      const decksWithCards = await Promise.all(
        decksData.map(async (deck) => {
          const { data: cardsData, error: cardsError } = await supabase
            .from('cards')
            .select('*')
            .eq('deck_id', deck.id)
            .order('created_at', { ascending: true });

          if (cardsError) throw cardsError;

          const cards: Flashcard[] = (cardsData || []).map(card => ({
            id: card.id,
            front: card.front,
            back: card.back,
            category: card.category,
            difficulty: card.difficulty,
            reviewCount: card.review_count,
            correctAnswers: card.correct_answers,
          }));

          return {
            id: deck.id,
            name: deck.name,
            description: deck.description,
            cards,
            createdAt: new Date(deck.created_at),
            updatedAt: new Date(deck.updated_at),
          };
        })
      );

      return decksWithCards;
    } catch (error) {
      console.error('Erro ao buscar decks:', error);
      return [];
    }
  }

  // Criar novo deck
  static async createDeck(deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>): Promise<Deck | null> {
    try {
      const now = new Date().toISOString();
      
      // Inserir deck
      const { data: deckData, error: deckError } = await supabase
        .from('decks')
        .insert({
          name: deck.name,
          description: deck.description,
          user_id: TEMP_USER_ID,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (deckError) throw deckError;

      // Inserir cards
      if (deck.cards.length > 0) {
        const cardsToInsert = deck.cards.map(card => ({
          deck_id: deckData.id,
          front: card.front,
          back: card.back,
          category: card.category,
          difficulty: card.difficulty,
          review_count: card.reviewCount,
          correct_answers: card.correctAnswers,
          created_at: now,
          updated_at: now,
        }));

        const { error: cardsError } = await supabase
          .from('cards')
          .insert(cardsToInsert);

        if (cardsError) throw cardsError;
      }

      return {
        id: deckData.id,
        name: deckData.name,
        description: deckData.description,
        cards: deck.cards,
        createdAt: new Date(deckData.created_at),
        updatedAt: new Date(deckData.updated_at),
      };
    } catch (error) {
      console.error('Erro ao criar deck:', error);
      return null;
    }
  }

  // Atualizar deck
  static async updateDeck(deck: Deck): Promise<Deck | null> {
    try {
      const now = new Date().toISOString();

      // Atualizar deck
      const { error: deckError } = await supabase
        .from('decks')
        .update({
          name: deck.name,
          description: deck.description,
          updated_at: now,
        })
        .eq('id', deck.id);

      if (deckError) throw deckError;

      // Deletar cards existentes
      const { error: deleteError } = await supabase
        .from('cards')
        .delete()
        .eq('deck_id', deck.id);

      if (deleteError) throw deleteError;

      // Inserir novos cards
      if (deck.cards.length > 0) {
        const cardsToInsert = deck.cards.map(card => ({
          deck_id: deck.id,
          front: card.front,
          back: card.back,
          category: card.category,
          difficulty: card.difficulty,
          review_count: card.reviewCount,
          correct_answers: card.correctAnswers,
          created_at: now,
          updated_at: now,
        }));

        const { error: cardsError } = await supabase
          .from('cards')
          .insert(cardsToInsert);

        if (cardsError) throw cardsError;
      }

      return {
        ...deck,
        updatedAt: new Date(now),
      };
    } catch (error) {
      console.error('Erro ao atualizar deck:', error);
      return null;
    }
  }

  // Deletar deck
  static async deleteDeck(deckId: string): Promise<boolean> {
    try {
      // Deletar cards primeiro (devido à foreign key)
      const { error: cardsError } = await supabase
        .from('cards')
        .delete()
        .eq('deck_id', deckId);

      if (cardsError) throw cardsError;

      // Deletar deck
      const { error: deckError } = await supabase
        .from('decks')
        .delete()
        .eq('id', deckId);

      if (deckError) throw deckError;

      return true;
    } catch (error) {
      console.error('Erro ao deletar deck:', error);
      return false;
    }
  }

  // ===== CARDS =====

  // Atualizar estatísticas de um card
  static async updateCardStats(cardId: string, reviewCount: number, correctAnswers: number): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cards')
        .update({
          review_count: reviewCount,
          correct_answers: correctAnswers,
          updated_at: new Date().toISOString(),
        })
        .eq('id', cardId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar estatísticas do card:', error);
      return false;
    }
  }

  // ===== UTILITÁRIOS =====

  // Verificar se o Supabase está configurado
  static isConfigured(): boolean {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  }

  // Fallback para localStorage quando Supabase não está configurado
  static getFallbackDecks(): Deck[] {
    try {
      const savedDecks = localStorage.getItem('flashcards-decks');
      if (savedDecks) {
        const parsedDecks = JSON.parse(savedDecks).map((deck: any) => ({
          ...deck,
          createdAt: new Date(deck.createdAt),
          updatedAt: new Date(deck.updatedAt),
        }));
        return parsedDecks;
      }
    } catch (error) {
      console.error('Erro ao carregar dados do localStorage:', error);
    }
    return [];
  }

  static saveFallbackDecks(decks: Deck[]): void {
    try {
      localStorage.setItem('flashcards-decks', JSON.stringify(decks));
    } catch (error) {
      console.error('Erro ao salvar dados no localStorage:', error);
    }
  }
} 