import React, { useState, useEffect } from 'react';
import { FillBlankQuestion as FillBlankQuestionType } from '../../types/question';

interface Props {
  question: FillBlankQuestionType;
  userAnswer: string[] | null;
  onAnswerChange: (answer: string[]) => void;
  showAnswer: boolean;
  disabled: boolean;
}

export const FillBlankQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  onAnswerChange,
  showAnswer,
  disabled
}) => {
  const [answers, setAnswers] = useState<string[]>(
    userAnswer || new Array(question.blanks.length).fill('')
  );

  useEffect(() => {
    onAnswerChange(answers);
  }, [answers, onAnswerChange]);

  const handleInputChange = (index: number, value: string) => {
    if (disabled) return;
    
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // 将题目文本按空格分割并插入输入框
  const renderQuestionWithBlanks = () => {
    const parts = question.question.split(/____/);
    const result = [];

    for (let i = 0; i < parts.length; i++) {
      result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      
      if (i < question.blanks.length) {
        const blank = question.blanks[i];
        const userAnswerValue = answers[i] || '';
        const isCorrect = showAnswer && userAnswerValue.toLowerCase() === blank.answer.toLowerCase();
        const isWrong = showAnswer && userAnswerValue && !isCorrect;
        
        let inputClassName = 'fill-blank-input';
        if (showAnswer) {
          if (isCorrect) {
            inputClassName += ' correct';
          } else if (isWrong) {
            inputClassName += ' wrong';
          }
        }

        result.push(
          <span key={`input-${i}`} className="blank-container">
            <input
              type="text"
              className={inputClassName}
              value={userAnswerValue}
              onChange={(e) => handleInputChange(i, e.target.value)}
              disabled={disabled}
              placeholder={`空格${i + 1}`}
            />
            {showAnswer && (
              <span className="correct-answer">({blank.answer})</span>
            )}
          </span>
        );
      }
    }

    return result;
  };

  return (
    <div className="fill-blank-question">
      <div className="question-text">
        <h3>{renderQuestionWithBlanks()}</h3>
      </div>

      {showAnswer && question.explanation && (
        <div className="explanation">
          <h4>解析：</h4>
          <p>{question.explanation}</p>
          <div className="correct-answers">
            <h5>正确答案：</h5>
            {question.blanks.map((blank, index) => (
              <p key={index}>空格{index + 1}: {blank.answer}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};