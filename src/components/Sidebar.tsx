import React, { useState, useEffect } from 'react';
import { ConfirmDialog } from './ConfirmDialog';
import { useAppStore } from '../stores/appStore';
import { PracticeConfig, QuestionType } from '../types/question';

const QUESTION_TYPE_MAP: Record<QuestionType, string> = {
  'single-choice': '单选题',
  'multi-choice': '多选题',
  'true-false': '判断题',
  'fill-blank': '填空题',
  'essay': '简答题',
};

export const Sidebar: React.FC = () => {
  const { 
    questionBanks, 
    currentSession, 
    startPractice, 
    loadQuestionBank,
    deleteQuestionBank,
    endPractice 
  } = useAppStore();
  
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [practiceConfig, setPracticeConfig] = useState<PracticeConfig>({
    mode: 'sequential',
    questionCount: 10,
    showAnswer: false
  });
  const [availableTypes, setAvailableTypes] = useState<QuestionType[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{bankId: string, bankName: string} | null>(null);

  useEffect(() => {
    if (selectedBank && questionBanks.has(selectedBank)) {
      const bank = questionBanks.get(selectedBank);
      const types = new Set(bank!.questions.map(q => q.type));
      setAvailableTypes(Array.from(types));
    } else {
      setAvailableTypes([]);
    }
    // 重置题型选择
    setPracticeConfig(prev => ({ ...prev, questionType: undefined }));
  }, [selectedBank, questionBanks]);

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

  const handleDeleteBank = (bankId: string, bankName: string) => {
    setPendingDelete({ bankId, bankName });
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      try {
        deleteQuestionBank(pendingDelete.bankId);
        if (selectedBank === pendingDelete.bankId) {
          setSelectedBank('');
        }
        alert('题库删除成功！');
      } catch (error) {
        alert('题库删除失败：' + error);
      }
    }
    setConfirmOpen(false);
    setPendingDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDelete(null);
  };

  const handleStartPractice = () => {
    if (!selectedBank) {
      alert('请选择题库');
      return;
    }
    if (practiceConfig.mode === 'type' && !practiceConfig.questionType) {
      alert('请选择要练习的题型');
      return;
    }
    
    try {
      startPractice(selectedBank, practiceConfig);
    } catch (error) {
      alert('开始练习失败：' + error);
    }
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as PracticeConfig['mode'];
    setPracticeConfig(prev => {
      const newConfig: PracticeConfig = { ...prev, mode: newMode };
      if (newMode !== 'type') {
        // 如果不是按题型练习，清除题型选择
        delete newConfig.questionType;
      } else {
        // 如果切换到按题型练习，默认选择第一个可用题型
        newConfig.questionType = availableTypes[0] || undefined;
      }
      return newConfig;
    });
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
          <div className="bank-list" key={questionBanks.size}>
            <h4>可用题库：</h4>
            {Array.from(questionBanks.entries()).map(([bankId, bank]) => (
              <div key={bankId} className={`bank-item ${selectedBank === bankId ? 'selected' : ''}`}>
                <label style={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="selectedBank"
                    value={bankId}
                    checked={selectedBank === bankId}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    style={{ marginRight: '10px', width: '16px', height: '16px', flexShrink: 0 }}
                  />
                  <div className="bank-info">
                    <div className="bank-title">{bank.metadata.title}</div>
                    <div className="bank-details">
                      {bank.metadata.totalQuestions}道题 | {bank.metadata.subject}
                    </div>
                  </div>
                </label>
                <button
                  className="delete-bank-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBank(bankId, bank.metadata.title);
                  }}
                  title="删除题库"
                >
                  &times;
                </button>
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
            onChange={handleModeChange}
            disabled={!selectedBank}
          >
            <option value="sequential">顺序练习</option>
            <option value="random">随机练习</option>
            <option value="type">按题型练习</option>
            <option value="wrong-questions">错题重做</option>
          </select>
        </div>

        {practiceConfig.mode === 'type' && (
          <div className="setting-group">
            <label>选择题型：</label>
            <select
              value={practiceConfig.questionType || ''}
              onChange={(e) => setPracticeConfig(prev => ({
                ...prev,
                questionType: e.target.value as QuestionType
              }))}
              disabled={availableTypes.length === 0}
            >
              {availableTypes.length > 0 ? (
                availableTypes.map(type => (
                  <option key={type} value={type}>
                    {QUESTION_TYPE_MAP[type] || type}
                  </option>
                ))
              ) : (
                <option disabled value="">暂无可用题型</option>
              )}
            </select>
          </div>
        )}

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
            disabled={!selectedBank}
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
              disabled={!selectedBank}
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

      <ConfirmDialog
        open={confirmOpen}
        title="删除题库"
        message={pendingDelete ? `确定要删除题库"${pendingDelete.bankName}"吗？此操作不可撤销。` : ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
