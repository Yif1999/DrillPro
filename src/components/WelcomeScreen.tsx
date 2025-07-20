import React from 'react';
import { useAppStore } from '../stores/appStore';


export const WelcomeScreen: React.FC = () => {
  const { startWrongQuestionsPractice } = useAppStore();

  return (
    <div className="welcome-screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 100px)' }}>
      <div className="welcome-content" style={{ maxWidth: '800px', width: '100%'}}>
        <h2 style={{ margin: '16px 0', textAlign: 'center', fontSize: '2rem' }}>高效刷题，助你轻松备考！</h2>
        <div className="welcome-info" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
          <div className="info-card" style={{ flex: 1, padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>🎯 支持题型</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>单选题</li>
              <li>多选题</li>
              <li>判断题</li>
              <li>填空题</li>
              <li>简答题</li>
            </ul>
          </div>
          <div className="info-card" style={{ flex: 1, padding: '1.5rem' }}>
            <h3 style={{ marginTop: 0 }}>⚡ 功能特色</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>智能错题记录</li>
              <li>多种练习模式</li>
              <li>实时统计分析</li>
              <li>本地数据存储</li>
            </ul>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
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