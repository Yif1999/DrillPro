import { create } from 'zustand';
import { Question, QuestionBank, AnswerSession, PracticeConfig } from '../types/question';
import { QuestionService } from '../services/questionService';
import { StorageService } from '../services/storageService';

interface AppState {
  // 服务实例
  questionService: QuestionService;
  storageService: StorageService;
  
  // 应用状态
  currentUser: string;
  questionBanks: Map<string, QuestionBank>;
  currentSession: AnswerSession | null;
  currentQuestions: Question[];
  currentQuestionIndex: number;
  
  // UI状态
  isLoading: boolean;
  showAnswer: boolean;
  practiceMode: 'practice' | 'exam' | 'review';
  
  // Actions
  initializeApp: () => Promise<void>;
  loadQuestionBank: (file: File) => Promise<void>;
  startPractice: (bankId: string, config: PracticeConfig) => void;
  submitAnswer: (answer: any, timeSpent: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  endPractice: () => AnswerSession;
  toggleAnswerDisplay: () => void;
  setCurrentUser: (userId: string) => void;
  startWrongQuestionsPractice: () => void;
}

export const useAppStore = create<AppState>((set, get) => {
  const storageService = new StorageService();
  return {
    // 初始状态
    questionService: new QuestionService(storageService),
    storageService,
  currentUser: 'default_user',
  questionBanks: new Map(),
  currentSession: null,
  currentQuestions: [],
  currentQuestionIndex: 0,
  isLoading: false,
  showAnswer: false,
  practiceMode: 'practice',

  // 初始化应用
  initializeApp: async () => {
    set({ isLoading: true });
    
    try {
      const { storageService, questionService } = get();
      
      // 加载本地题库
      const savedBanks = storageService.getQuestionBanks();
      const bankMap = new Map<string, QuestionBank>();
      
      for (const [bankId, bank] of Object.entries(savedBanks)) {
        bankMap.set(bankId, bank);
        await questionService.loadQuestionBank(bankId, bank);
      }
      
      // 加载示例题库（如果没有任何题库）
      if (bankMap.size === 0) {
        try {
          const response = await fetch('/data/sample-questions.json');
          const sampleBank = await response.json();
          const bankId = 'sample_wireless_network';
          
          bankMap.set(bankId, sampleBank);
          await questionService.loadQuestionBank(bankId, sampleBank);
          storageService.saveQuestionBank(bankId, sampleBank);
        } catch (error) {
          console.warn('无法加载示例题库:', error);
        }
      }
      
      set({ questionBanks: bankMap });
      
    } catch (error) {
      console.error('初始化失败:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // 加载题库文件
  loadQuestionBank: async (file: File) => {
    set({ isLoading: true });
    
    try {
      const { questionService, storageService } = get();
      const text = await file.text();
      const bankData: QuestionBank = JSON.parse(text);
      
      // 验证题库格式
      if (!bankData.metadata || !bankData.questions) {
        throw new Error('题库格式不正确');
      }
      
      const bankId = file.name.replace('.json', '') + '_' + Date.now();
      
      // 更新服务和存储
      await questionService.loadQuestionBank(bankId, bankData);
      storageService.saveQuestionBank(bankId, bankData);
      
      // 更新状态
      const newBanks = new Map(get().questionBanks);
      newBanks.set(bankId, bankData);
      set({ questionBanks: newBanks });
      
    } catch (error) {
      console.error('加载题库失败:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // 开始练习
  startPractice: (bankId: string, config: PracticeConfig) => {
    const { questionService, currentUser } = get();
    
    try {
      // 生成练习题目
      const questions = questionService.generatePracticeQuestions(bankId, config);
      if (questions.length === 0) {
        throw new Error('没有符合条件的题目');
      }
      
      // 开始答题会话
      const sessionId = `session_${Date.now()}`;
      const session = questionService.startSession(sessionId, currentUser, questions);
      
      set({
        currentSession: session,
        currentQuestions: questions,
        currentQuestionIndex: 0,
        showAnswer: config.showAnswer || false,
        practiceMode: config.showAnswer ? 'practice' : 'exam'
      });
      
    } catch (error) {
      console.error('开始练习失败:', error);
      throw error;
    }
  },

  // 提交答案
  submitAnswer: (answer: any, timeSpent: number) => {
    const { questionService, currentQuestions, currentQuestionIndex, storageService } = get();
    
    try {
      const currentQuestion = currentQuestions[currentQuestionIndex];
      if (!currentQuestion) {
        throw new Error('当前题目不存在');
      }
      
      questionService.submitAnswer(currentQuestion.id, answer, timeSpent);
      
      // 更新当前会话状态
      const updatedSession = questionService.getCurrentSession();
      set({ currentSession: updatedSession });
      
      // 如果是最后一题，自动结束练习
      if (currentQuestionIndex === currentQuestions.length - 1) {
        const finalSession = questionService.endSession();
        storageService.saveSession(finalSession);
        set({ currentSession: finalSession });
      }
      
    } catch (error) {
      console.error('提交答案失败:', error);
      throw error;
    }
  },

  // 下一题
  nextQuestion: () => {
    const { currentQuestionIndex, currentQuestions } = get();
    if (currentQuestionIndex < currentQuestions.length - 1) {
      set({ 
        currentQuestionIndex: currentQuestionIndex + 1,
        showAnswer: false 
      });
    }
  },

  // 上一题
  previousQuestion: () => {
    const { currentQuestionIndex } = get();
    if (currentQuestionIndex > 0) {
      set({ 
        currentQuestionIndex: currentQuestionIndex - 1,
        showAnswer: false 
      });
    }
  },

  // 结束练习
  endPractice: () => {
    const { questionService, storageService } = get();
    
    try {
      const session = questionService.endSession();
      storageService.saveSession(session);
      
      // 重置状态
      set({
        currentSession: null,
        currentQuestions: [],
        currentQuestionIndex: 0,
        showAnswer: false
      });
      
      return session;
    } catch (error) {
      console.error('结束练习失败:', error);
      throw error;
    }
  },

  // 切换答案显示
  toggleAnswerDisplay: () => {
    set(state => ({ showAnswer: !state.showAnswer }));
  },

  // 设置当前用户
  setCurrentUser: (userId: string) => {
    set({ currentUser: userId });
  },

  // 开始错题重做
  startWrongQuestionsPractice: () => {
    const { questionService, currentUser } = get();
    
    try {
      // 获取错题列表
      const wrongQuestions = questionService.getWrongQuestionsForUser(currentUser);
      if (wrongQuestions.length === 0) {
        throw new Error('暂无错题记录');
      }
      
      // 开始答题会话
      const sessionId = `wrong_questions_${Date.now()}`;
      const session = questionService.startSession(sessionId, currentUser, wrongQuestions);
      
      set({
        currentSession: session,
        currentQuestions: wrongQuestions,
        currentQuestionIndex: 0,
        showAnswer: false,
        practiceMode: 'practice'
      });
      
    } catch (error) {
      console.error('开始错题重做失败:', error);
      throw error;
    }
  }
}});