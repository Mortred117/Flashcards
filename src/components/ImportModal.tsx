import React, { useState, useRef } from 'react';
import { Deck, Flashcard } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [importType, setImportType] = useState<'json' | 'txt'>('json');
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [parsedCards, setParsedCards] = useState<Flashcard[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      parseFileContent(content);
    };
    reader.readAsText(file);
  };

  const parseFileContent = (content: string) => {
    setError('');
    setSuccess('');
    setParsedCards([]);

    try {
      if (importType === 'json') {
        parseJSONContent(content);
      } else {
        parseTXTContent(content);
      }
    } catch (err) {
      setError('Erro ao processar o arquivo. Verifique o formato.');
    }
  };

  const parseJSONContent = (content: string) => {
    const data = JSON.parse(content);
    
    // Verificar se é um array de cartões ou um objeto com cartões
    let cards: any[] = [];
    
    if (Array.isArray(data)) {
      // Formato: array de cartões
      cards = data;
    } else if (data.cards && Array.isArray(data.cards)) {
      // Formato: objeto com propriedade cards
      cards = data.cards;
      if (data.name && !deckName) setDeckName(data.name);
      if (data.description && !deckDescription) setDeckDescription(data.description);
    } else {
      throw new Error('Formato JSON inválido');
    }

    const parsedCards: Flashcard[] = cards.map((card) => ({
      id: card.id || `imported-${Date.now()}-${Math.random()}`,
      front: card.front || card.question || card.pergunta || '',
      back: card.back || card.answer || card.resposta || '',
      category: card.category || card.categoria || 'Importado',
      difficulty: card.difficulty || card.dificuldade || 'médio',
      reviewCount: 0,
      correctAnswers: 0,
    }));

    setParsedCards(parsedCards);
    setSuccess(`${parsedCards.length} cartões importados com sucesso!`);
  };

  const parseTXTContent = (content: string) => {
    const lines = content.split('\n').filter(line => line.trim());
    const cards: Flashcard[] = [];
    
    for (let i = 0; i < lines.length; i += 2) {
      const front = lines[i]?.trim();
      const back = lines[i + 1]?.trim();
      
      if (front && back) {
        cards.push({
          id: `imported-${Date.now()}-${i}`,
          front,
          back,
          category: 'Importado',
          difficulty: 'médio',
          reviewCount: 0,
          correctAnswers: 0,
        });
      }
    }

    setParsedCards(cards);
    setSuccess(`${cards.length} cartões importados com sucesso!`);
  };

  const handleImport = () => {
    if (!deckName.trim()) {
      setError('Por favor, insira um nome para o baralho');
      return;
    }

    if (parsedCards.length === 0) {
      setError('Nenhum cartão válido encontrado para importar');
      return;
    }

    const newDeck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'> = {
      name: deckName.trim(),
      description: deckDescription.trim() || 'Baralho importado',
      cards: parsedCards,
    };

    onImport(newDeck);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setImportType('json');
    setDeckName('');
    setDeckDescription('');
    setError('');
    setSuccess('');
    setParsedCards([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>📥 Importar Baralho</h2>
          <button className="modal-close" onClick={handleClose}>
            ❌
          </button>
        </div>

        <div className="modal-content">
          <div className="import-type-selector">
            <label>
              <input
                type="radio"
                value="json"
                checked={importType === 'json'}
                onChange={(e) => setImportType(e.target.value as 'json')}
              />
              📄 JSON
            </label>
            <label>
              <input
                type="radio"
                value="txt"
                checked={importType === 'txt'}
                onChange={(e) => setImportType(e.target.value as 'txt')}
              />
              📝 TXT
            </label>
          </div>

          <div className="form-group">
            <label>📝 Nome do Baralho</label>
            <input
              type="text"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="Nome do baralho importado"
            />
          </div>

          <div className="form-group">
            <label>📄 Descrição (opcional)</label>
            <textarea
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              placeholder="Descrição do baralho"
              rows={2}
            />
          </div>

          <div className="file-upload">
            <label className="file-upload-label">
              📁
              <span>
                {importType === 'json' 
                  ? 'Selecionar arquivo JSON' 
                  : 'Selecionar arquivo TXT'
                }
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept={importType === 'json' ? '.json' : '.txt'}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {importType === 'json' && (
            <div className="format-info">
              <h4>📋 Formato JSON aceito:</h4>
              <pre>{`[
  {
    "front": "Pergunta",
    "back": "Resposta",
    "category": "Categoria",
    "difficulty": "fácil"
  }
]`}</pre>
            </div>
          )}

          {importType === 'txt' && (
            <div className="format-info">
              <h4>📋 Formato TXT aceito:</h4>
              <pre>{`Pergunta 1
Resposta 1
Pergunta 2
Resposta 2`}</pre>
            </div>
          )}

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              ✅ {success}
            </div>
          )}

          {parsedCards.length > 0 && (
            <div className="preview-section">
              <h4>👀 Prévia dos cartões ({parsedCards.length}):</h4>
              <div className="cards-preview">
                {parsedCards.slice(0, 3).map((card) => (
                  <div key={card.id} className="preview-card">
                    <div className="preview-front">
                      <strong>❓ Frente:</strong> {card.front}
                    </div>
                    <div className="preview-back">
                      <strong>💡 Verso:</strong> {card.back}
                    </div>
                  </div>
                ))}
                {parsedCards.length > 3 && (
                  <div className="preview-more">
                    ... e mais {parsedCards.length - 3} cartões
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn secondary" onClick={handleClose}>
            ❌ Cancelar
          </button>
          <button 
            className="btn primary" 
            onClick={handleImport}
            disabled={parsedCards.length === 0 || !deckName.trim()}
          >
            📥 Importar Baralho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal; 