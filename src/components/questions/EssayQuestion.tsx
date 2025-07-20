import React, { useState, useEffect } from 'react';
import { EssayQuestion as EssayQuestionType } from '../../types/question';

interface Props {
  question: EssayQuestionType;
  userAnswer: string | null;
  onAnswerChange: (answer: string) => void;
  showAnswer: boolean;
  disabled: boolean;
}

export const EssayQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  onAnswerChange,
  showAnswer,
  disabled
}) => {
  const [text, setText] = useState(userAnswer || '');

  useEffect(() => {
    onAnswerChange(text);
  }, [text, onAnswerChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    setText(e.target.value);
  };

  // 判断是否为中文字符
  const isChinese = (str: string) => /[\u4e00-\u9fa5]/.test(str);

  const wordCount = isChinese(text)
    ? text.replace(/\s/g, '').length // 中文按字符数统计，去除空白
    : text.trim().split(/\s+/).filter(word => word.length > 0).length; // 其他按单词数

  return (
    <div className="essay-question">
      <div className="question-text">
        <h3>{question.question}</h3>
        {(question.minWords || question.maxWords) && (
          <div className="word-requirements">
            {question.minWords && <span>最少 {question.minWords} 字</span>}
            {question.maxWords && <span>最多 {question.maxWords} 字</span>}
          </div>
        )}
      </div>

      <div className="essay-input-container">
        <textarea
          className="essay-textarea"
          value={text}
          onChange={handleTextChange}
          disabled={disabled}
          placeholder="请在此输入您的答案..."
          rows={8}
        />
        <div className="word-counter">
          当前字数: {wordCount}
          {question.minWords && wordCount < question.minWords && (
            <span className="warning"> (少于最少要求)</span>
          )}
          {question.maxWords && wordCount > question.maxWords && (
            <span className="warning"> (超过最多限制)</span>
          )}
        </div>
      </div>

      {question.keywords && question.keywords.length > 0 && (
        <div className="keywords-hint">
          <h4>关键词提示：</h4>
          <div className="keywords">
            {question.keywords.map((keyword, index) => (
              <span 
                key={index} 
                className={`keyword ${
                  text.toLowerCase().includes(keyword.toLowerCase()) ? 'found' : ''
                }`}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {showAnswer && (
        <div className="explanation">
          <h4>参考答案：</h4>
          <div className="reference-answer">
            {question.answer}
          </div>
          {question.explanation && (
            <div className="scoring-guide">
              <h5>评分说明：</h5>
              <p>{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};