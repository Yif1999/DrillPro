import { Question, QuestionBank, PracticeConfig, AnswerSession, QuestionRecord, UserAnswer } from '../types/question';
import { StorageService } from './storageService';

export class QuestionService {
  private questionBanks: Map<string, QuestionBank> = new Map();
  private currentSession: AnswerSession | null = null;
  private storageService: StorageService;

  constructor(storageService?: StorageService) {
    this.storageService = storageService || new StorageService();
  }

  /**
   * 加载题库
   */
  async loadQuestionBank(bankId: string, data: QuestionBank): Promise<void> {
    this.questionBanks.set(bankId, data);
  }

  /**
   * 删除题库
   */
  deleteQuestionBank(bankId: string): void {
    this.questionBanks.delete(bankId);
  }

  /**
   * 获取题库列表
   */
  getQuestionBanks(): Map<string, QuestionBank> {
    return this.questionBanks;
  }

  /**
   * 根据配置生成练习题目
   */
  generatePracticeQuestions(bankId: string, config: PracticeConfig): Question[] {
    const bank = this.questionBanks.get(bankId);
    if (!bank) {
      throw new Error('题库未找到');
    }

    let questions = [...bank.questions];

    // 按分类筛选
    if (config.categories && config.categories.length > 0) {
      questions = questions.filter(q => 
        config.categories!.includes(q.category || '')
      );
    }

    // 按难度筛选
    if (config.difficulties && config.difficulties.length > 0) {
      questions = questions.filter(q => 
        config.difficulties!.includes(q.difficulty || 'easy')
      );
    }

    // 根据模式排序/筛选
    switch (config.mode) {
      case 'random':
        questions = this.shuffleArray(questions);
        break;
      case 'sequential':
        // 保持原有顺序
        break;
      case 'wrong-questions':
        // 从错题记录中筛选
        questions = this.getWrongQuestions(bankId, questions);
        break;
    }

    // 限制题目数量
    if (config.questionCount && config.questionCount < questions.length) {
      questions = questions.slice(0, config.questionCount);
    }

    return questions;
  }

  /**
   * 开始答题会话
   */
  startSession(sessionId: string, userId: string, questions: Question[]): AnswerSession {
    this.currentSession = {
      sessionId,
      userId,
      startTime: new Date().toISOString(),
      questions: [],
      totalScore: 0,
      totalQuestions: questions.length,
      correctCount: 0,
      accuracy: 0
    };

    return this.currentSession;
  }

  /**
   * 提交单题答案
   */
  submitAnswer(questionId: string, userAnswer: UserAnswer, timeSpent: number): QuestionRecord {
    if (!this.currentSession) {
      throw new Error('没有活跃的答题会话');
    }

    // 寻找对应题目
    const question = this.findQuestionById(questionId);
    if (!question) {
      throw new Error('题目未找到');
    }

    // 判断答案正确性
    const isCorrect = this.checkAnswer(question, userAnswer);
    const score = isCorrect ? question.score : 0;

    // 针对不同题型获取正确答案
    let correctAnswer: UserAnswer;
    switch (question.type) {
      case 'single-choice':
      case 'multi-choice':
      case 'true-false':
      case 'essay':
        correctAnswer = question.answer;
        break;
      case 'fill-blank':
        correctAnswer = question.blanks.map(b => b.answer);
        break;
      default:
        correctAnswer = '';
    }

    const record: QuestionRecord = {
      questionId,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeSpent,
      score
    };

    // 更新会话记录
    this.currentSession.questions.push(record);
    this.currentSession.totalScore += score;
    if (isCorrect) {
      this.currentSession.correctCount++;
    }
    this.currentSession.accuracy = this.currentSession.correctCount / this.currentSession.questions.length;

    return record;
  }

  /**
   * 结束答题会话
   */
  endSession(): AnswerSession {
    if (!this.currentSession) {
      throw new Error('没有活跃的答题会话');
    }

    this.currentSession.endTime = new Date().toISOString();
    const session = this.currentSession;
    this.currentSession = null;

    return session;
  }

  /**
   * 获取当前会话
   */
  getCurrentSession(): AnswerSession | null {
    return this.currentSession;
  }

  /**
   * 检查答案正确性
   */
  private checkAnswer(question: Question, userAnswer: UserAnswer): boolean {
    switch (question.type) {
      case 'single-choice':
        return userAnswer === question.answer;
      
      case 'multi-choice':
        if (!Array.isArray(userAnswer) || !Array.isArray(question.answer)) {
          return false;
        }
        return this.arraysEqual(userAnswer.sort(), question.answer.sort());
      
      case 'true-false':
        return userAnswer === question.answer;
      
      case 'fill-blank':
        if (!Array.isArray(userAnswer)) return false;
        return question.blanks.every((blank, index) => {
          const userAnswerStr = String(userAnswer[index] || '').trim();
          const correctAnswer = blank.answer.trim();
          return blank.caseSensitive 
            ? userAnswerStr === correctAnswer
            : userAnswerStr.toLowerCase() === correctAnswer.toLowerCase();
        });
      
      case 'essay':
        // 简答题需要更复杂的评分逻辑，这里简化处理
        const userText = String(userAnswer).toLowerCase();
        const keywords = question.keywords || [];
        const matchedKeywords = keywords.filter(keyword => 
          userText.includes(keyword.toLowerCase())
        );
        // 如果匹配到一半以上关键词，认为正确
        return matchedKeywords.length >= Math.ceil(keywords.length / 2);
      
      default:
        return false;
    }
  }

  /**
   * 查找题目
   */
  private findQuestionById(questionId: string): Question | null {
    for (const bank of this.questionBanks.values()) {
      const question = bank.questions.find(q => q.id === questionId);
      if (question) return question;
    }
    return null;
  }

  /**
   * 数组随机排序
   */
  private shuffleArray<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * 比较数组是否相等
   */
  private arraysEqual<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

  /**
   * 获取错题
   */
  private getWrongQuestions(_bankId: string, allQuestions: Question[]): Question[] {
    if (!this.currentSession) return [];
    
    const wrongQuestionIds = this.storageService.getUserWrongQuestions(this.currentSession.userId);
    return allQuestions.filter(question => wrongQuestionIds.includes(question.id));
  }

  /**
   * 获取统计信息
   */
  getStatistics(userId: string): {
    totalSessions: number;
    totalQuestions: number;
    totalCorrect: number;
    averageAccuracy: number;
    categoryStats: Record<string, { correct: number; total: number; accuracy: number }>;
  } {
    const sessions = this.storageService.getUserSessions(userId);
    
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        averageAccuracy: 0,
        categoryStats: {}
      };
    }

    let totalQuestions = 0;
    let totalCorrect = 0;
    const categoryStats: Record<string, { correct: number; total: number; accuracy: number }> = {};

    sessions.forEach(session => {
      totalQuestions += session.totalQuestions;
      totalCorrect += session.correctCount;

      // 统计各分类的数据
      session.questions.forEach(record => {
        const question = this.findQuestionById(record.questionId);
        if (question && question.category) {
          if (!categoryStats[question.category]) {
            categoryStats[question.category] = { correct: 0, total: 0, accuracy: 0 };
          }
          categoryStats[question.category].total++;
          if (record.isCorrect) {
            categoryStats[question.category].correct++;
          }
        }
      });
    });

    // 计算各分类的正确率
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category];
      stats.accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
    });

    const averageAccuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;

    return {
      totalSessions: sessions.length,
      totalQuestions,
      totalCorrect,
      averageAccuracy,
      categoryStats
    };
  }

  /**
   * 获取错题列表（供错题重做使用）
   */
  getWrongQuestionsForUser(userId: string): Question[] {
    const wrongQuestionIds = this.storageService.getUserWrongQuestions(userId);
    const questions: Question[] = [];
    
    wrongQuestionIds.forEach(questionId => {
      const question = this.findQuestionById(questionId);
      if (question) {
        questions.push(question);
      }
    });

    return questions;
  }

  /**
   * Deletes a wrong question for a specific user.
   */
  public async deleteUserWrongQuestion(userId: string, questionId: string): Promise<void> {
    this.storageService.deleteWrongQuestion(userId, questionId);
    console.log(`Question ${questionId} deleted from wrong questions for user ${userId}.`);
    // Optionally, you might want to refresh the list of wrong questions in the store
    // if the app state directly depends on a cached list in questionService.
  }
}