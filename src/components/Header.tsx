import React from 'react';
import { useAppStore } from '../stores/appStore';

export const Header: React.FC = () => {
  const { currentSession } = useAppStore();

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">DrillPro 刷题神器</h1>
      </div>
      
      <div className="header-center">
        {currentSession && (
          <div className="session-info">
            <span>题目进度: {currentSession.questions.length}/{currentSession.totalQuestions}</span>
            <span>正确率: {(currentSession.accuracy * 100).toFixed(1)}%</span>
            <span>得分: {currentSession.totalScore}</span>
          </div>
        )}
      </div>
      
      <div className="header-right">
        <button
          className="btn btn-secondary"
          style={{ marginLeft: 16 }}
          onClick={() => {
            document.body.classList.toggle('dark');
          }}
        >
          暗黑模式
        </button>
      </div>
    </header>
  );
};