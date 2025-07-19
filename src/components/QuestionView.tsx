import React, { useState, useEffect } from 'react';
import { useAppStore } from '../stores/appStore';
import { SingleChoiceQuestion } from './questions/SingleChoiceQuestion';
import { MultiChoiceQuestion } from './questions/MultiChoiceQuestion';
import { TrueFalseQuestion } from './questions/TrueFalseQuestion';
import { FillBlankQuestion } from './questions/FillBlankQuestion';
import { EssayQuestion } from './questions/EssayQuestion';

export const QuestionView: React.FC = () => {
  const {
    currentQuestions,
    currentQuestionIndex,
    showAnswer,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    toggleAnswerDisplay
  } = useAppStore();

  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const currentQuestion = currentQuestions[currentQuestionIndex];

  // 重置答题状态
  useEffect(() => {
    setUserAnswer(null);
    setHasSubmitted(false);
    setStartTime(Date.now());
    setTimeSpent(0);
  }, [currentQuestionIndex]);

  // 计时器
  useEffect(() => {
    if (!hasSubmitted) {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startTime, hasSubmitted]);

  const handleSubmit = () => {
    if (userAnswer === null || userAnswer === undefined) {
      alert('请先作答');
      return;
    }

    try {
      submitAnswer(userAnswer, timeSpent);
      setHasSubmitted(true);
    } catch (error) {
      alert('提交失败：' + error);
    }
  };

  const handleNext = () => {
    nextQuestion();
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  const renderQuestionComponent = () => {
    const baseProps = {
      userAnswer,
      onAnswerChange: setUserAnswer,
      showAnswer: showAnswer || hasSubmitted,
      disabled: hasSubmitted
    };

    switch (currentQuestion.type) {
      case 'single-choice':
        return <SingleChoiceQuestion question={currentQuestion} {...baseProps} />;
      case 'multi-choice':
        return <MultiChoiceQuestion question={currentQuestion} {...baseProps} />;
      case 'true-false':
        return <TrueFalseQuestion question={currentQuestion} {...baseProps} />;
      case 'fill-blank':
        return <FillBlankQuestion question={currentQuestion} {...baseProps} />;
      case 'essay':
        return <EssayQuestion question={currentQuestion} {...baseProps} />;
      default:
        return <div>不支持的题目类型</div>;
    }
  };

  if (!currentQuestion) {
    return <div>没有题目</div>;
  }

  return (
    <div className="question-view">
      <div className="question-header">
        <div className="question-nav">
          <span className="question-counter">
            第 {currentQuestionIndex + 1} / {currentQuestions.length} 题
          </span>
          <span className="timer">⏱️ {timeSpent}秒</span>
        </div>
        
        <div className="question-meta">
          <span className="category">{currentQuestion.category}</span>
          <span className="difficulty">{currentQuestion.difficulty}</span>
          <span className="score">分值: {currentQuestion.score}</span>
        </div>
      </div>

      <div className="question-content">
        {renderQuestionComponent()}
      </div>

      <div className="question-actions unified-actions">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary"
        >
          上一题
        </button>
        {!hasSubmitted && (
          <button
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={userAnswer === null}
          >
            提交答案
          </button>
        )}
        {!showAnswer && (
          <button
            onClick={toggleAnswerDisplay}
            className="btn btn-outline"
          >
            查看答案
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={currentQuestionIndex === currentQuestions.length - 1}
          className="btn btn-secondary"
        >
          下一题
        </button>
      </div>
    </div>
  );
};