import React from 'react';
import { TrueFalseQuestion as TrueFalseQuestionType } from '../../types/question';

interface Props {
  question: TrueFalseQuestionType;
  userAnswer: boolean | null;
  onAnswerChange: (answer: boolean) => void;
  showAnswer: boolean;
  disabled: boolean;
}

export const TrueFalseQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  onAnswerChange,
  showAnswer,
  disabled
}) => {
  return (
    <div className="true-false-question">
      <div className="question-text">
        <h3>{question.question}</h3>
      </div>

      <div className="options">
        {[
          { value: true, label: '正确' },
          { value: false, label: '错误' }
        ].map(({ value, label }) => {
          const isSelected = userAnswer === value;
          const isCorrect = question.answer === value;
          
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
            <div key={String(value)} className={className}>
              <label>
                <input
                  type="radio"
                  name="trueFalse"
                  checked={isSelected}
                  onChange={() => onAnswerChange(value)}
                  disabled={disabled}
                />
                <span className="option-text">{label}</span>
              </label>
            </div>
          );
        })}
      </div>

      {showAnswer && question.explanation && (
        <div className="explanation">
          <h4>解析：</h4>
          <p>{question.explanation}</p>
          <p><strong>正确答案：</strong>{question.answer ? '正确' : '错误'}</p>
        </div>
      )}
    </div>
  );
};