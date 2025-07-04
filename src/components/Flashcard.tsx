import React, { useState } from 'react';
import { Flashcard as FlashcardType } from '../types';
import { RotateCcw, Check, X } from 'lucide-react';

interface FlashcardProps {
  card: FlashcardType;
  onAnswer: (isCorrect: boolean) => void;
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ card, onAnswer, isFlipped, onFlip }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    onFlip();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleAnswer = (isCorrect: boolean) => {
    onAnswer(isCorrect);
  };

  // Função utilitária para contar linhas
  function getLineCount(text: string) {
    return text.split(/\r?\n/).length;
  }

  // Função para determinar classe de tamanho de fonte
  function getFontSizeClass(text: string) {
    const lineCount = getLineCount(text);
    if (lineCount >= 7) return 'font-xs'; // Muito grande
    if (lineCount >= 5) return 'font-sm'; // Grande
    if (lineCount >= 3) return 'font-md'; // Médio
    return '';
  }

  return (
    <div className="flashcard-container">
      <div 
        className={`flashcard ${isFlipped ? 'flipped' : ''} ${isAnimating ? 'animating' : ''}`}
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <h3 className={getFontSizeClass(card.front)}>{card.front}</h3>
            <p className="category">{card.category}</p>
            <p className="difficulty">Dificuldade: {card.difficulty}</p>
            <div className="flip-hint">
              <RotateCcw size={20} />
              <span>Clique para virar</span>
            </div>
          </div>
          <div className="flashcard-back">
            <h3 className={getFontSizeClass(card.back)}>{card.back}</h3>
            <div className="answer-buttons">
              <button 
                className="answer-btn incorrect"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(false);
                }}
              >
                <X size={20} />
                Errei
              </button>
              <button 
                className="answer-btn correct"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAnswer(true);
                }}
              >
                <Check size={20} />
                Acertei
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard; 