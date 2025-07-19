import React, { useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { PracticeConfig } from '../types/question';

export const Sidebar: React.FC = () => {
  const { 
    questionBanks, 
    currentSession, 
    startPractice, 
    loadQuestionBank,
    endPractice 
  } = useAppStore();
  
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [practiceConfig, setPracticeConfig] = useState<PracticeConfig>({
    mode: 'sequential',
    questionCount: 10,
    showAnswer: false
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await loadQuestionBank(file);
        alert('题库加载成功！');
      } catch (error) {
        alert('题库加载失败：' + error);
      }
    }
  };

  const handleStartPractice = () => {
    if (!selectedBank) {
      alert('请选择题库');
      return;
    }
    
    try {
      startPractice(selectedBank, practiceConfig);
    } catch (error) {
      alert('开始练习失败：' + error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>题库管理</h3>
        
        <div className="file-upload">
          <label htmlFor="file-input" className="file-upload-label">
            📁 加载题库文件
          </label>
          <input
            id="file-input"
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        {questionBanks.size > 0 && (
          <div className="bank-list">
            <h4>可用题库：</h4>
            {Array.from(questionBanks.entries()).map(([bankId, bank]) => (
              <div key={bankId} className={`bank-item ${selectedBank === bankId ? 'selected' : ''}`}>
                <label>
                  <input
                    type="radio"
                    name="selectedBank"
                    value={bankId}
                    checked={selectedBank === bankId}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  />
                  <div className="bank-info">
                    <div className="bank-title">{bank.metadata.title}</div>
                    <div className="bank-details">
                      {bank.metadata.totalQuestions}道题 | {bank.metadata.subject}
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sidebar-section">
        <h3>练习设置</h3>
        
        <div className="setting-group">
          <label>练习模式：</label>
          <select 
            value={practiceConfig.mode}
            onChange={(e) => setPracticeConfig(prev => ({
              ...prev, 
              mode: e.target.value as any
            }))}
          >
            <option value="sequential">顺序练习</option>
            <option value="random">随机练习</option>
            <option value="wrong-questions">错题重做</option>
          </select>
        </div>

        <div className="setting-group">
          <label>题目数量：</label>
          <input
            type="number"
            min="1"
            max="100"
            value={practiceConfig.questionCount || ''}
            onChange={(e) => setPracticeConfig(prev => ({
              ...prev,
              questionCount: parseInt(e.target.value) || undefined
            }))}
          />
        </div>

        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={practiceConfig.showAnswer || false}
              onChange={(e) => setPracticeConfig(prev => ({
                ...prev,
                showAnswer: e.target.checked
              }))}
            />
            立即显示答案
          </label>
        </div>

        <div className="action-buttons">
          {!currentSession ? (
            <button 
              className="btn btn-primary"
              onClick={handleStartPractice}
              disabled={!selectedBank}
            >
              开始练习
            </button>
          ) : (
            <button 
              className="btn btn-secondary"
              onClick={endPractice}
            >
              结束练习
            </button>
          )}
        </div>
      </div>
    </div>
  );
};