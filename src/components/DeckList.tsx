import React from 'react';
import { Deck } from '../types';

interface DeckListProps {
  decks: Deck[];
  onSelectDeck: (deck: Deck) => void;
  onEditDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
  onAddDeck: () => void;
}

const DeckList: React.FC<DeckListProps> = ({ decks, onSelectDeck, onEditDeck, onDeleteDeck, onAddDeck }) => {
  if (decks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <h3>Nenhum baralho encontrado</h3>
        <p>Crie seu primeiro baralho de flashcards para começar a estudar!</p>
        <button className="btn primary" onClick={onAddDeck} style={{marginTop: '20px'}}>
            Criar Novo Deck
        </button>
      </div>
    );
  }

  return (
    <div className="deck-list">
      {decks.map((deck) => (
        <div key={deck.id} className="deck-card">
          <div className="deck-header">
            <div>
              <h3 className="deck-title">{deck.name}</h3>
              <p className="deck-description">{deck.description}</p>
            </div>
          </div>
          
          <div className="deck-stats">
            <span>📊 {deck.cards.length} cartões</span>
            <span>📅 {deck.createdAt.toLocaleDateString('pt-BR')}</span>
            {deck.updatedAt && (
              <span>🔄 {deck.updatedAt.toLocaleDateString('pt-BR')}</span>
            )}
          </div>
          
          <div className="deck-actions">
            <button 
              className="btn primary" 
              onClick={() => onSelectDeck(deck)}
              title="Estudar este baralho"
            >
              ▶️ Estudar
            </button>
            <button 
              className="btn secondary" 
              onClick={() => onEditDeck(deck)}
              title="Editar este baralho"
            >
              ✏️ Editar
            </button>
            <button 
              className="btn danger" 
              onClick={() => onDeleteDeck(deck.id)}
              title="Excluir este baralho"
            >
              🗑️ Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeckList; 