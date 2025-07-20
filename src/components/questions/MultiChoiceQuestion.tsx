import React from 'react';
import { MultiChoiceQuestion as MultiChoiceQuestionType } from '../../types/question';

interface Props {
  question: MultiChoiceQuestionType;
  userAnswer: string[] | null;
  onAnswerChange: (answer: string[]) => void;
  showAnswer: boolean;
  disabled: boolean;
}

export const MultiChoiceQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  onAnswerChange,
  showAnswer,
  disabled
}) => {
  const options = ['A', 'B', 'C', 'D'];
  const selectedOptions = userAnswer || [];

  const handleOptionChange = (optionKey: string) => {
    if (disabled) return;

    const newSelection = selectedOptions.includes(optionKey)
      ? selectedOptions.filter(key => key !== optionKey)
      : [...selectedOptions, optionKey];
    
    onAnswerChange(newSelection);
  };

  return (
    <div className="multi-choice-question">
      <div className="question-text">
        <h3>{question.question}</h3>
        <p className="hint">（可选择多个答案）</p>
      </div>

      <div className="options">
        {question.options.map((option, index) => {
          const optionKey = options[index];
          const isSelected = selectedOptions.includes(optionKey);
          const isCorrect = question.answer.includes(optionKey);
          
          let className = 'option';
          if (showAnswer) {
            if (isCorrect) {
              className += ' correct';
            } else if (isSelected && !isCorrect) {
              className += ' wrong';
            }
          } else if (isSelected) {
            className += ' selected';
          }

          return (
            <div
              key={optionKey}
              className={className}
              onClick={() => handleOptionChange(optionKey)}
            >
              <div className="option-content">
                <input
                  type="checkbox"
                  value={optionKey}
                  checked={isSelected}
                  onChange={() => {}}
                  disabled={disabled}
                />
                <span className="option-key">{optionKey}</span>
                <span className="option-text">{option}</span>
              </div>
            </div>
          );
        })}
      </div>

      {showAnswer && question.explanation && (
        <div className="explanation">
          <h4>解析：</h4>
          <p>{question.explanation}</p>
          <p><strong>正确答案：</strong>{question.answer.join(', ')}</p>
        </div>
      )}
    </div>
  );
};