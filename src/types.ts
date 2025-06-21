export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
  difficulty?: 'fácil' | 'médio' | 'difícil';
  reviewCount: number;
  correctAnswers: number;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cards: Flashcard[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudySession {
  id: string;
  deckId: string;
  startTime: Date;
  endTime?: Date;
  cardsReviewed: number;
  correctAnswers: number;
  incorrectAnswers: number;
} 