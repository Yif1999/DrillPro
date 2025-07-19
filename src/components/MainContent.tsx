import React from 'react';
import { useAppStore } from '../stores/appStore';
import { QuestionView } from './QuestionView';
import { WelcomeScreen } from './WelcomeScreen';
import { ResultsScreen } from './ResultsScreen';

export const MainContent: React.FC = () => {
  const { currentSession, currentQuestions } = useAppStore();

  // 显示结果页面
  if (currentSession && currentSession.endTime) {
    return <ResultsScreen session={currentSession} />;
  }

  // 显示答题页面
  if (currentSession && currentQuestions.length > 0) {
    return <QuestionView />;
  }

  // 显示欢迎页面
  return <WelcomeScreen />;
};