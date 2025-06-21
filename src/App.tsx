import { useState, useEffect } from 'react';
import './App.css';
import { Deck } from './types';
import { SupabaseService } from './services/supabaseService';
import DeckList from './components/DeckList';
import DeckEditor from './components/DeckEditor';
import StudySession from './components/StudySession';
import ImportModal from './components/ImportModal';

type AppState = 'list' | 'editor' | 'study';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('list');
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    checkSupabaseConfiguration();
    loadDecks();
  }, []);

  const checkSupabaseConfiguration = () => {
    const configured = SupabaseService.isConfigured();
    setIsSupabaseConfigured(configured);
  };

  const loadDecks = async () => {
    try {
      setLoading(true);
      const loadedDecks = await SupabaseService.getDecks();
      setDecks(loadedDecks);
    } catch (error) {
      console.error('Erro ao carregar decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = () => {
    setCurrentDeck(null);
    setCurrentState('editor');
  };

  const handleEditDeck = (deck: Deck) => {
    setCurrentDeck(deck);
    setCurrentState('editor');
  };

  const handleStudyDeck = (deck: Deck) => {
    setCurrentDeck(deck);
    setCurrentState('study');
  };

  const handleImport = () => {
    setIsImportModalOpen(true);
  };

  const handleBackToList = () => {
    setCurrentState('list');
    setCurrentDeck(null);
    loadDecks();
  };

  const handleSaveDeck = async (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'> | Deck) => {
    try {
      let savedDeck: Deck | null;
      
      if ('id' in deck && deck.id) {
        savedDeck = await SupabaseService.updateDeck(deck as Deck);
      } else {
        savedDeck = await SupabaseService.createDeck(deck);
      }

      if (savedDeck) {
        handleBackToList();
      }
    } catch (error) {
      console.error('Erro ao salvar deck:', error);
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este deck e todos os seus cards?')) {
      try {
        const success = await SupabaseService.deleteDeck(deckId);
        if (success) {
          loadDecks();
        }
      } catch (error) {
        console.error('Erro ao deletar deck:', error);
      }
    }
  };

  const handleImportSuccess = (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => {
    handleSaveDeck(deck);
    setIsImportModalOpen(false);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="app-container">
          <div className="loading-state">
            Carregando...
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentState) {
      case 'editor':
        return <DeckEditor deck={currentDeck || undefined} onSave={handleSaveDeck} onCancel={handleBackToList} />;
      case 'study':
        return currentDeck ? <StudySession deck={currentDeck} onBack={handleBackToList} /> : null;
      case 'list':
      default:
        return (
          <DeckList
            decks={decks}
            onEditDeck={handleEditDeck}
            onDeleteDeck={handleDeleteDeck}
            onSelectDeck={handleStudyDeck}
            onAddDeck={handleCreateDeck}
          />
        );
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>Flashcards</h1>
          <div className="header-actions">
            {isSupabaseConfigured ? (
              <span className="storage-indicator">✅ Conectado ao Supabase</span>
            ) : (
              <span className="storage-indicator">❌ Supabase não configurado</span>
            )}
            {currentState === 'list' && (
              <>
                <button className="btn primary" onClick={handleCreateDeck}>
                  Criar Novo Deck
                </button>
                <button className="btn secondary" onClick={handleImport}>
                  Importar Deck
                </button>
              </>
            )}
            {(currentState === 'editor' || currentState === 'study') && (
              <button className="btn secondary" onClick={handleBackToList}>
                Voltar à Lista
              </button>
            )}
          </div>
        </header>

        <main>
          {renderContent()}
        </main>

        {isImportModalOpen && (
          <ImportModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onImport={handleImportSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default App; 