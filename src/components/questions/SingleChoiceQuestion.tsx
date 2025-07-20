import React from 'react';
import { SingleChoiceQuestion as SingleChoiceQuestionType } from '../../types/question';

interface Props {
  question: SingleChoiceQuestionType;
  userAnswer: string | null;
  onAnswerChange: (answer: string) => void;
  showAnswer: boolean;
  disabled: boolean;
}

export const SingleChoiceQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  onAnswerChange,
  showAnswer,
  disabled
}) => {
  const options = ['A', 'B', 'C', 'D'];

  return (
    <div className="single-choice-question">
      <div className="question-text">
        <h3>{question.question}</h3>
      </div>

      <div className="options">
        {Array.isArray(question.options) ? (
          question.options.map((option, index) => {
            const optionKey = options[index];
            const isSelected = userAnswer === optionKey;
            const isCorrect = question.answer === optionKey;

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
                onClick={() => !disabled && onAnswerChange(optionKey)}
              >
                <div className="option-content">
                  <input
                    type="radio"
                    name="singleChoice"
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
          })
        ) : (
          <div className="error-message">
            错误：此题目 (ID: {question.id}) 的选项数据丢失或格式不正确。
          </div>
        )}
      </div>

      {showAnswer && question.explanation && (
        <div className="explanation">
          <h4>解析：</h4>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
};