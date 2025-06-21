import React, { useState, useEffect } from 'react';
import { Deck, Flashcard } from '../types';

interface DeckEditorProps {
  deck?: Deck;
  onSave: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const DeckEditor: React.FC<DeckEditorProps> = ({ deck, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);

  useEffect(() => {
    if (deck) {
      setName(deck.name);
      setDescription(deck.description || '');
      setCards([...deck.cards]);
    }
  }, [deck]);

  const handleAddCard = () => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front: '',
      back: '',
      category: 'Geral',
      difficulty: 'médio',
      reviewCount: 0,
      correctAnswers: 0,
    };
    setCards([...cards, newCard]);
  };

  const handleUpdateCard = (index: number, field: keyof Flashcard, value: string | undefined) => {
    const updatedCards = [...cards];
    updatedCards[index] = { ...updatedCards[index], [field]: value || '' };
    setCards(updatedCards);
  };

  const handleRemoveCard = (index: number) => {
    const updatedCards = cards.filter((_, i) => i !== index);
    setCards(updatedCards);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Por favor, insira um nome para o baralho.');
      return;
    }

    if (cards.length === 0) {
      alert('Por favor, adicione pelo menos um cartão.');
      return;
    }

    const validCards = cards.filter(card => card.front.trim() && card.back.trim());
    if (validCards.length === 0) {
      alert('Por favor, preencha pelo menos um cartão completamente.');
      return;
    }

    onSave({
      name: name.trim(),
      description: description.trim(),
      cards: validCards,
    });
  };

  return (
    <div className="deck-editor">
      <div className="editor-header">
        <button className="btn secondary" onClick={onCancel}>
          ⬅️ Voltar
        </button>
        <h2>{deck ? '✏️ Editar Baralho' : '➕ Novo Baralho'}</h2>
        <button className="btn primary" onClick={handleSave}>
          💾 Salvar
        </button>
      </div>

      <div className="editor-content">
        <div className="form-group">
          <label>📝 Nome do Baralho</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite o nome do baralho"
          />
        </div>

        <div className="form-group">
          <label>📄 Descrição (opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva o conteúdo do baralho"
            rows={3}
          />
        </div>

        <div className="cards-section">
          <div className="cards-header">
            <h3>🃏 Cartões ({cards.length})</h3>
            <button className="btn primary" onClick={handleAddCard}>
              ➕ Adicionar Cartão
            </button>
          </div>

          <div className="card-list">
            {cards.map((card, index) => (
              <div key={card.id} className="card-item">
                <div className="card-header">
                  <span className="card-number">📋 Cartão {index + 1}</span>
                  <div className="card-actions">
                    <button 
                      className="btn danger" 
                      onClick={() => handleRemoveCard(index)}
                      title="Remover cartão"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="card-content">
                  <div className="form-group">
                    <label>❓ Frente (Pergunta)</label>
                    <textarea
                      value={card.front}
                      onChange={(e) => handleUpdateCard(index, 'front', e.target.value)}
                      placeholder="Digite a pergunta ou conceito"
                      rows={2}
                    />
                  </div>

                  <div className="form-group">
                    <label>💡 Verso (Resposta)</label>
                    <textarea
                      value={card.back}
                      onChange={(e) => handleUpdateCard(index, 'back', e.target.value)}
                      placeholder="Digite a resposta ou explicação"
                      rows={2}
                    />
                  </div>

                  <div className="card-options">
                    <div className="form-group">
                      <label>🏷️ Categoria</label>
                      <input
                        type="text"
                        value={card.category}
                        onChange={(e) => handleUpdateCard(index, 'category', e.target.value)}
                        placeholder="Ex: Gramática, Vocabulário"
                      />
                    </div>

                    <div className="form-group">
                      <label>📊 Dificuldade</label>
                      <select
                        value={card.difficulty}
                        onChange={(e) => handleUpdateCard(index, 'difficulty', e.target.value)}
                      >
                        <option value="fácil">🟢 Fácil</option>
                        <option value="médio">🟡 Médio</option>
                        <option value="difícil">🔴 Difícil</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cards.length === 0 && (
            <div className="empty-cards">
              <p>📝 Nenhum cartão adicionado ainda.</p>
              <p>Clique em "Adicionar Cartão" para começar!</p>
            </div>
          )}
        </div>
      </div>

      <div className="editor-footer">
        <button className="btn secondary" onClick={onCancel}>
          ❌ Cancelar
        </button>
        <button className="btn primary" onClick={handleSave}>
          💾 Salvar Baralho
        </button>
      </div>
    </div>
  );
};

export default DeckEditor; 