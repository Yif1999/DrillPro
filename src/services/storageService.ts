import { AnswerSession, QuestionBank } from '../types/question';

export class StorageService {
  private static readonly KEYS = {
    QUESTION_BANKS: 'drillpro_question_banks',
    SESSIONS: 'drillpro_sessions',
    SETTINGS: 'drillpro_settings',
    WRONG_QUESTIONS: 'drillpro_wrong_questions'
  };

  /**
   * 保存题库
   */
  saveQuestionBank(bankId: string, bank: QuestionBank): void {
    try {
      const banks = this.getQuestionBanks();
      banks[bankId] = bank;
      localStorage.setItem(StorageService.KEYS.QUESTION_BANKS, JSON.stringify(banks));
    } catch (error) {
      console.error('保存题库失败:', error);
      throw new Error('保存题库失败');
    }
  }

  /**
   * 获取所有题库
   */
  getQuestionBanks(): Record<string, QuestionBank> {
    try {
      const data = localStorage.getItem(StorageService.KEYS.QUESTION_BANKS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('读取题库失败:', error);
      return {};
    }
  }

  /**
   * 获取单个题库
   */
  getQuestionBank(bankId: string): QuestionBank | null {
    const banks = this.getQuestionBanks();
    return banks[bankId] || null;
  }

  /**
   * 删除题库
   */
  deleteQuestionBank(bankId: string): void {
    try {
      const banks = this.getQuestionBanks();
      delete banks[bankId];
      localStorage.setItem(StorageService.KEYS.QUESTION_BANKS, JSON.stringify(banks));
    } catch (error) {
      console.error('删除题库失败:', error);
      throw new Error('删除题库失败');
    }
  }

  /**
   * 保存答题会话
   */
  saveSession(session: AnswerSession): void {
    try {
      const sessions = this.getSessions();
      sessions.push(session);
      localStorage.setItem(StorageService.KEYS.SESSIONS, JSON.stringify(sessions));
      
      // 同时更新错题记录
      this.updateWrongQuestions(session);
    } catch (error) {
      console.error('保存答题记录失败:', error);
      throw new Error('保存答题记录失败');
    }
  }

  /**
   * 获取所有答题会话
   */
  getSessions(): AnswerSession[] {
    try {
      const data = localStorage.getItem(StorageService.KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('读取答题记录失败:', error);
      return [];
    }
  }

  /**
   * 获取用户的答题会话
   */
  getUserSessions(userId: string): AnswerSession[] {
    return this.getSessions().filter(session => session.userId === userId);
  }

  /**
   * 更新错题记录
   */
  private updateWrongQuestions(session: AnswerSession): void {
    try {
      const wrongQuestions = this.getWrongQuestions();
      
      session.questions.forEach(record => {
        if (!record.isCorrect) {
          const key = `${session.userId}_${record.questionId}`;
          wrongQuestions[key] = {
            userId: session.userId,
            questionId: record.questionId,
            wrongCount: (wrongQuestions[key]?.wrongCount || 0) + 1,
            lastWrongTime: session.endTime || session.startTime,
            userAnswer: record.userAnswer,
            correctAnswer: record.correctAnswer
          };
        }
      });

      localStorage.setItem(StorageService.KEYS.WRONG_QUESTIONS, JSON.stringify(wrongQuestions));
    } catch (error) {
      console.error('更新错题记录失败:', error);
    }
  }

  /**
   * 获取错题记录
   */
  getWrongQuestions(): Record<string, {
    userId: string;
    questionId: string;
    wrongCount: number;
    lastWrongTime: string;
    userAnswer: any;
    correctAnswer: any;
  }> {
    try {
      const data = localStorage.getItem(StorageService.KEYS.WRONG_QUESTIONS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('读取错题记录失败:', error);
      return {};
    }
  }

  /**
   * 获取用户错题
   */
  getUserWrongQuestions(userId: string): string[] {
    const wrongQuestions = this.getWrongQuestions();
    return Object.values(wrongQuestions)
      .filter(record => record.userId === userId)
      .map(record => record.questionId);
  }

  /**
   * 保存应用设置
   */
  saveSettings(settings: Record<string, any>): void {
    try {
      localStorage.setItem(StorageService.KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('保存设置失败:', error);
      throw new Error('保存设置失败');
    }
  }

  /**
   * 获取应用设置
   */
  getSettings(): Record<string, any> {
    try {
      const data = localStorage.getItem(StorageService.KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('读取设置失败:', error);
      return {};
    }
  }

  /**
   * 清除所有数据
   */
  clearAllData(): void {
    try {
      Object.values(StorageService.KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('清除数据失败:', error);
      throw new Error('清除数据失败');
    }
  }

  /**
   * 导出数据（用于备份）
   */
  exportData(): string {
    try {
      const data = {
        questionBanks: this.getQuestionBanks(),
        sessions: this.getSessions(),
        wrongQuestions: this.getWrongQuestions(),
        settings: this.getSettings(),
        exportTime: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('导出数据失败:', error);
      throw new Error('导出数据失败');
    }
  }

  /**
   * 导入数据（用于恢复）
   */
  importData(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.questionBanks) {
        localStorage.setItem(StorageService.KEYS.QUESTION_BANKS, JSON.stringify(data.questionBanks));
      }
      if (data.sessions) {
        localStorage.setItem(StorageService.KEYS.SESSIONS, JSON.stringify(data.sessions));
      }
      if (data.wrongQuestions) {
        localStorage.setItem(StorageService.KEYS.WRONG_QUESTIONS, JSON.stringify(data.wrongQuestions));
      }
      if (data.settings) {
        localStorage.setItem(StorageService.KEYS.SETTINGS, JSON.stringify(data.settings));
      }
    } catch (error) {
      console.error('导入数据失败:', error);
      throw new Error('导入数据失败，请检查文件格式');
    }
  }
}