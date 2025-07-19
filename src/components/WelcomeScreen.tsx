import React from 'react';
import { useAppStore } from '../stores/appStore';


export const WelcomeScreen: React.FC = () => {
  const { startWrongQuestionsPractice } = useAppStore();

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <h2 style={{ margin: '16px 0' }}>高效刷题，助你轻松备考！</h2>
        <div className="welcome-info">
          <div className="info-card">
            <h3>🎯 支持题型</h3>
            <ul>
              <li>单选题</li>
              <li>多选题</li>
              <li>判断题</li>
              <li>填空题</li>
              <li>简答题</li>
            </ul>
          </div>
          <div className="info-card">
            <h3>⚡ 功能特色</h3>
            <ul>
              <li>智能错题记录</li>
              <li>多种练习模式</li>
              <li>实时统计分析</li>
              <li>本地数据存储</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <button
            className="btn btn-primary"
            style={{ fontSize: 18, padding: '10px 32px' }}
            onClick={() => {
              try {
                startWrongQuestionsPractice();
              } catch (error) {
                alert('暂无错题记录，无法进入错题界面');
              }
            }}
          >
            查看错题
          </button>
        </div>
      </div>
    </div>
  );
};