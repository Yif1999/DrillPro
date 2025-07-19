# 题库数据格式规范

## 整体结构

```json
{
  "metadata": {
    "title": "题库标题",
    "description": "题库描述",
    "subject": "科目/分类",
    "version": "1.0.0",
    "createdAt": "2025-01-15T00:00:00Z",
    "totalQuestions": 150,
    "categories": ["基础知识", "应用题", "综合题"],
    "difficulties": ["easy", "medium", "hard"]
  },
  "questions": [
    // 题目数组
  ]
}
```

## 题目类型定义

### 1. 单选题 (single-choice)
```json
{
  "id": "q001",
  "type": "single-choice",
  "category": "基础知识", 
  "difficulty": "easy",
  "score": 2,
  "question": "以下哪个是正确的？",
  "options": [
    "选项A",
    "选项B", 
    "选项C",
    "选项D"
  ],
  "answer": "A",
  "explanation": "解析说明"
}
```

### 2. 多选题 (multi-choice)
```json
{
  "id": "q002",
  "type": "multi-choice",
  "category": "应用题",
  "difficulty": "medium", 
  "score": 3,
  "question": "以下哪些选项正确？（多选）",
  "options": [
    "选项A",
    "选项B",
    "选项C", 
    "选项D"
  ],
  "answer": ["A", "C"],
  "explanation": "解析说明"
}
```

### 3. 判断题 (true-false)
```json
{
  "id": "q003",
  "type": "true-false",
  "category": "基础知识",
  "difficulty": "easy",
  "score": 1,
  "question": "地球是圆的。",
  "answer": true,
  "explanation": "解析说明"
}
```

### 4. 填空题 (fill-blank)
```json
{
  "id": "q004", 
  "type": "fill-blank",
  "category": "应用题",
  "difficulty": "medium",
  "score": 3,
  "question": "中国的首都是____，面积约为____万平方公里。",
  "blanks": [
    {
      "index": 0,
      "answer": "北京",
      "caseSensitive": false
    },
    {
      "index": 1, 
      "answer": "1.6",
      "caseSensitive": false
    }
  ],
  "explanation": "解析说明"
}
```

### 5. 简答题 (essay)
```json
{
  "id": "q005",
  "type": "essay", 
  "category": "综合题",
  "difficulty": "hard",
  "score": 10,
  "question": "请简述人工智能的发展历程。",
  "answer": "参考答案...",
  "keywords": ["图灵测试", "机器学习", "深度学习", "神经网络"],
  "minWords": 100,
  "maxWords": 500,
  "explanation": "评分标准说明"
}
```

## 字段说明

### 必填字段
- `id`: 题目唯一标识
- `type`: 题目类型
- `question`: 题目内容
- `answer`: 正确答案
- `score`: 题目分值

### 可选字段  
- `category`: 题目分类
- `difficulty`: 难度等级
- `explanation`: 解析说明
- `tags`: 标签数组
- `source`: 题目来源
- `timeLimit`: 答题时间限制(秒)

## 答题记录格式

```json
{
  "userId": "user001",
  "sessionId": "session_20250115_001", 
  "startTime": "2025-01-15T10:00:00Z",
  "endTime": "2025-01-15T10:30:00Z",
  "questions": [
    {
      "questionId": "q001",
      "userAnswer": "A",
      "correctAnswer": "A", 
      "isCorrect": true,
      "timeSpent": 30,
      "score": 2
    }
  ],
  "totalScore": 85,
  "totalQuestions": 50,
  "correctCount": 42,
  "accuracy": 0.84
}
```