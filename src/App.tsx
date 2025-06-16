import React, { useState, useEffect } from 'react';
import { Deck } from './types';
import DeckList from './components/DeckList';
import StudySession from './components/StudySession';
import DeckEditor from './components/DeckEditor';
import ImportModal from './components/ImportModal';
import { SupabaseService } from './services/supabaseService';
import './App.css';

type View = 'list' | 'study' | 'editor';

const App: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [editingDeck, setEditingDeck] = useState<Deck | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  // Carregar dados
  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    setIsLoading(true);
    
    if (SupabaseService.isConfigured()) {
      // Usar Supabase
      setIsUsingSupabase(true);
      const supabaseDecks = await SupabaseService.getDecks();
      setDecks(supabaseDecks);
    } else {
      // Usar localStorage como fallback
      setIsUsingSupabase(false);
      const localDecks = SupabaseService.getFallbackDecks();
      setDecks(localDecks);
    }
    
    setIsLoading(false);
  };

  // Salvar dados
  useEffect(() => {
    if (!isLoading && decks.length > 0) {
      if (isUsingSupabase) {
        // No Supabase, os dados são salvos automaticamente nas operações
        // Não precisamos fazer nada aqui
      } else {
        // Salvar no localStorage
        SupabaseService.saveFallbackDecks(decks);
      }
    }
  }, [decks, isLoading, isUsingSupabase]);

  const handleCreateDeck = () => {
    setEditingDeck(null);
    setCurrentView('editor');
  };

  const handleEditDeck = (deck: Deck) => {
    setEditingDeck(deck);
    setCurrentView('editor');
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (confirm('Tem certeza que deseja excluir este baralho?')) {
      if (isUsingSupabase) {
        const success = await SupabaseService.deleteDeck(deckId);
        if (success) {
          setDecks(decks.filter((deck: Deck) => deck.id !== deckId));
        } else {
          alert('Erro ao excluir o baralho. Tente novamente.');
        }
      } else {
        setDecks(decks.filter((deck: Deck) => deck.id !== deckId));
      }
    }
  };

  const handleSaveDeck = async (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (isUsingSupabase) {
      if (editingDeck) {
        // Atualizar deck existente
        const updatedDeck = await SupabaseService.updateDeck({
          ...deck,
          id: editingDeck.id,
          createdAt: editingDeck.createdAt,
          updatedAt: new Date(),
        });
        
        if (updatedDeck) {
          setDecks(decks.map((d: Deck) => d.id === editingDeck.id ? updatedDeck : d));
          setCurrentView('list');
          setEditingDeck(null);
        } else {
          alert('Erro ao atualizar o baralho. Tente novamente.');
        }
      } else {
        // Criar novo deck
        const newDeck = await SupabaseService.createDeck(deck);
        if (newDeck) {
          setDecks([...decks, newDeck]);
          setCurrentView('list');
        } else {
          alert('Erro ao criar o baralho. Tente novamente.');
        }
      }
    } else {
      // Usar localStorage
      if (editingDeck) {
        const updatedDeck: Deck = {
          ...deck,
          id: editingDeck.id,
          createdAt: editingDeck.createdAt,
          updatedAt: new Date(),
        };
        setDecks(decks.map((d: Deck) => d.id === editingDeck.id ? updatedDeck : d));
      } else {
        const newDeck: Deck = {
          ...deck,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setDecks([...decks, newDeck]);
      }
      setCurrentView('list');
      setEditingDeck(null);
    }
  };

  const handleStudyDeck = (deck: Deck) => {
    setSelectedDeck(deck);
    setCurrentView('study');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedDeck(null);
    setEditingDeck(null);
  };

  const handleImportDeck = async (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (isUsingSupabase) {
      const newDeck = await SupabaseService.createDeck(deck);
      if (newDeck) {
        setDecks([...decks, newDeck]);
      } else {
        alert('Erro ao importar o baralho. Tente novamente.');
      }
    } else {
      const newDeck: Deck = {
        ...deck,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setDecks([...decks, newDeck]);
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'study':
        return selectedDeck ? (
          <StudySession deck={selectedDeck} onBack={handleBackToList} />
        ) : null;
      case 'editor':
        return (
          <DeckEditor
            deck={editingDeck || undefined}
            onSave={handleSaveDeck}
            onCancel={handleBackToList}
          />
        );
      default:
        return (
          <div className="app-container">
            <header className="app-header">
              <h1>📚 Flashcards App</h1>
              <div className="header-actions">
                <div className="storage-indicator">
                  {isUsingSupabase ? (
                    <span title="Usando Supabase">☁️</span>
                  ) : (
                    <span title="Usando localStorage">💾</span>
                  )}
                </div>
                <button className="btn secondary" onClick={() => setIsImportModalOpen(true)} title="Importar baralho">
                  📥 Importar
                </button>
                <button className="btn primary" onClick={handleCreateDeck}>
                  ➕ Novo Baralho
                </button>
              </div>
            </header>
            
            {isLoading ? (
              <div className="loading-state">
                <p>⏳ Carregando baralhos...</p>
              </div>
            ) : (
              <DeckList
                decks={decks}
                onSelectDeck={handleStudyDeck}
                onEditDeck={handleEditDeck}
                onDeleteDeck={handleDeleteDeck}
              />
            )}
            
            <ImportModal
              isOpen={isImportModalOpen}
              onClose={() => setIsImportModalOpen(false)}
              onImport={handleImportDeck}
            />
          </div>
        );
    }
  };

  return (
    <div className="app">
      {renderView()}
    </div>
  );
};

export default App; 