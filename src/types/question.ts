// 题目类型枚举
export type QuestionType = 'single-choice' | 'multi-choice' | 'true-false' | 'fill-blank' | 'essay';

// 难度等级
export type Difficulty = 'easy' | 'medium' | 'hard';

// 基础题目接口
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  category?: string;
  difficulty?: Difficulty;
  score: number;
  question: string;
  explanation?: string;
  tags?: string[];
  source?: string;
  timeLimit?: number; // 秒
}

// 单选题
export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single-choice';
  options: string[];
  answer: string; // A, B, C, D
}

// 多选题
export interface MultiChoiceQuestion extends BaseQuestion {
  type: 'multi-choice';
  options: string[];
  answer: string[]; // ['A', 'C']
}

// 判断题
export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  answer: boolean;
}

// 填空题
export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill-blank';
  blanks: {
    index: number;
    answer: string;
    caseSensitive?: boolean;
  }[];
}

// 简答题
export interface EssayQuestion extends BaseQuestion {
  type: 'essay';
  answer: string;
  keywords?: string[];
  minWords?: number;
  maxWords?: number;
}

// 联合类型
export type Question = 
  | SingleChoiceQuestion 
  | MultiChoiceQuestion 
  | TrueFalseQuestion 
  | FillBlankQuestion 
  | EssayQuestion;

// 题库元数据
export interface QuestionBankMetadata {
  title: string;
  description?: string;
  subject?: string;
  version: string;
  createdAt: string;
  totalQuestions: number;
  categories: string[];
  difficulties: Difficulty[];
}

// 题库结构
export interface QuestionBank {
  metadata: QuestionBankMetadata;
  questions: Question[];
}

// 用户答案类型
export type UserAnswer = string | string[] | boolean | string[];

// 答题记录
export interface QuestionRecord {
  questionId: string;
  userAnswer: UserAnswer;
  correctAnswer: UserAnswer;
  isCorrect: boolean;
  timeSpent: number; // 秒
  score: number;
}

// 答题会话
export interface AnswerSession {
  userId: string;
  sessionId: string;
  startTime: string;
  endTime?: string;
  questions: QuestionRecord[];
  totalScore: number;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
}

// 练习模式
export type PracticeMode = 'sequential' | 'random' | 'category' | 'difficulty' | 'wrong-questions';

// 练习配置
export interface PracticeConfig {
  mode: PracticeMode;
  questionCount?: number;
  categories?: string[];
  difficulties?: Difficulty[];
  timeLimit?: number; // 总时间限制（分钟）
  showAnswer?: boolean; // 是否立即显示答案
  allowReview?: boolean; // 是否允许回顾
}