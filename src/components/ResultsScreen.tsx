import React from 'react';
import { AnswerSession } from '../types/question';
import { useAppStore } from '../stores/appStore';

interface Props {
  session: AnswerSession;
}

export const ResultsScreen: React.FC<Props> = ({ session }) => {
  const { endPractice } = useAppStore();

  const startTime = new Date(session.startTime);
  const endTime = session.endTime ? new Date(session.endTime) : new Date();
  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const getGrade = (accuracy: number) => {
    if (accuracy >= 0.9) return { grade: 'A', color: '#4CAF50', text: '优秀' };
    if (accuracy >= 0.8) return { grade: 'B', color: '#8BC34A', text: '良好' };
    if (accuracy >= 0.7) return { grade: 'C', color: '#FFC107', text: '及格' };
    return { grade: 'D', color: '#F44336', text: '需要努力' };
  };

  const gradeInfo = getGrade(session.accuracy);

  return (
    <div className="results-screen">
      <div className="results-header">
        <h2>练习完成！</h2>
        <div className="grade-display" style={{ color: gradeInfo.color }}>
          <div className="grade-letter">{gradeInfo.grade}</div>
          <div className="grade-text">{gradeInfo.text}</div>
        </div>
      </div>

      <div className="results-summary">
        <div className="summary-card">
          <h3>总体情况</h3>
          <div className="summary-stats">
            <div className="stat">
              <span className="label">总题数:</span>
              <span className="value">{session.totalQuestions}</span>
            </div>
            <div className="stat">
              <span className="label">正确数:</span>
              <span className="value">{session.correctCount}</span>
            </div>
            <div className="stat">
              <span className="label">正确率:</span>
              <span className="value">{(session.accuracy * 100).toFixed(1)}%</span>
            </div>
            <div className="stat">
              <span className="label">总分:</span>
              <span className="value">{session.totalScore}</span>
            </div>
            <div className="stat">
              <span className="label">用时:</span>
              <span className="value">{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="results-details">
        <h3>题目详情</h3>
        <div className="question-results">
          {session.questions.map((record, index) => (
            <div key={record.questionId} className={`question-result ${record.isCorrect ? 'correct' : 'wrong'}`}>
              <div className="question-number">第{index + 1}题</div>
              <div className="question-status">
                {record.isCorrect ? '✓' : '✗'}
              </div>
              <div className="question-score">
                {record.score}分
              </div>
              <div className="question-time">
                {formatTime(record.timeSpent)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="results-actions">
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          重新开始
        </button>

        <button 
          className="btn btn-outline"
          onClick={() => {
            try {
              const { startWrongQuestionsPractice } = useAppStore.getState();
              startWrongQuestionsPractice();
            } catch (error) {
              alert('错题重做失败：' + (error as Error).message);
            }
          }}
        >
          错题重做
        </button>
      </div>
    </div>
  );
};