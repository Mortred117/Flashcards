import React, { useState, useEffect } from 'react';
import { Deck, Flashcard } from '../types';
import { SupabaseService } from '../services/supabaseService';

interface StudySessionProps {
  deck: Deck;
  onBack: () => void;
}

const StudySession: React.FC<StudySessionProps> = ({ deck, onBack }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [stats, setStats] = useState({
    correct: 0,
    incorrect: 0,
    skipped: 0,
  });

  useEffect(() => {
    // Embaralhar os cards para o estudo
    const shuffledCards = [...deck.cards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffledCards);
  }, [deck]);

  const currentCard = studyCards[currentCardIndex];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const updateCardStats = async (cardId: string, isCorrect: boolean) => {
    const card = studyCards.find(c => c.id === cardId);
    if (!card) return;

    const newReviewCount = card.reviewCount + 1;
    const newCorrectAnswers = isCorrect ? card.correctAnswers + 1 : card.correctAnswers;

    // Atualizar no estado local
    setStudyCards(prev => prev.map(c => 
      c.id === cardId 
        ? { ...c, reviewCount: newReviewCount, correctAnswers: newCorrectAnswers }
        : c
    ));

    // Salvar no Supabase se estiver configurado
    if (SupabaseService.isConfigured()) {
      await SupabaseService.updateCardStats(cardId, newReviewCount, newCorrectAnswers);
    }
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (!currentCard) return;

    await updateCardStats(currentCard.id, isCorrect);
    
    setStats(prev => ({
      ...prev,
      [isCorrect ? 'correct' : 'incorrect']: prev[isCorrect ? 'correct' : 'incorrect'] + 1,
    }));

    nextCard();
  };

  const handleSkip = () => {
    setStats(prev => ({ ...prev, skipped: prev.skipped + 1 }));
    nextCard();
  };

  const nextCard = () => {
    setIsFlipped(false);
    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Sessão concluída
      alert(`🎉 Sessão concluída!\n\n✅ Respostas corretas: ${stats.correct}\n❌ Respostas incorretas: ${stats.incorrect}\n⏭️ Puladas: ${stats.skipped}`);
      onBack();
    }
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setStats({ correct: 0, incorrect: 0, skipped: 0 });
    // Embaralhar novamente
    const shuffledCards = [...deck.cards].sort(() => Math.random() - 0.5);
    setStudyCards(shuffledCards);
  };

  if (!currentCard) {
    return (
      <div className="study-session">
        <div className="study-header">
          <button className="btn secondary" onClick={onBack}>
            ⬅️ Voltar
          </button>
          <h2>📖 Estudando: {deck.name}</h2>
        </div>
        <div className="no-cards">
          <p>❌ Nenhum card encontrado neste baralho.</p>
        </div>
      </div>
    );
  }

  const progress = ((currentCardIndex + 1) / studyCards.length) * 100;

  return (
    <div className="study-session">
      <div className="study-header">
        <button className="btn secondary" onClick={onBack}>
          ⬅️ Voltar
        </button>
        <h2>📖 Estudando: {deck.name}</h2>
        <button className="btn secondary" onClick={resetSession}>
          🔄 Reiniciar
        </button>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        <span className="progress-text">
          {currentCardIndex + 1} de {studyCards.length}
        </span>
      </div>

      <div className="stats">
        <span>✅ {stats.correct}</span>
        <span>❌ {stats.incorrect}</span>
        <span>⏭️ {stats.skipped}</span>
      </div>

      <div className="card-container">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={handleFlip}
        >
          <div className="card-front">
            <h3>{currentCard.front}</h3>
            <p className="card-category">{currentCard.category}</p>
            <p className="card-difficulty">Dificuldade: {currentCard.difficulty}</p>
            <p className="card-stats">
              📊 Revisões: {currentCard.reviewCount} | 
              🎯 Acertos: {currentCard.correctAnswers} | 
              📈 Taxa: {currentCard.reviewCount > 0 ? Math.round((currentCard.correctAnswers / currentCard.reviewCount) * 100) : 0}%
            </p>
          </div>
          <div className="card-back">
            <h3>{currentCard.back}</h3>
            <p className="card-category">{currentCard.category}</p>
            <p className="card-difficulty">Dificuldade: {currentCard.difficulty}</p>
            <p className="card-stats">
              📊 Revisões: {currentCard.reviewCount} | 
              🎯 Acertos: {currentCard.correctAnswers} | 
              📈 Taxa: {currentCard.reviewCount > 0 ? Math.round((currentCard.correctAnswers / currentCard.reviewCount) * 100) : 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="study-controls">
        <button 
          className="btn danger" 
          onClick={() => handleAnswer(false)}
        >
          ❌ Errei
        </button>
        <button 
          className="btn secondary" 
          onClick={handleSkip}
        >
          ⏭️ Pular
        </button>
        <button 
          className="btn success" 
          onClick={() => handleAnswer(true)}
        >
          ✅ Acertei
        </button>
      </div>
    </div>
  );
};

export default StudySession; 