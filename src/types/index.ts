export type ProgrammingLanguage = 'c' | 'cpp' | 'java' | 'python' | 'javascript' | 'html' | 'css';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type DifficultyLevel = 'Basic' | 'Intermediate' | 'Advanced';

export type QuestionPurpose = 'Assignment' | 'Practice' | 'Exam Preparation';

export type AnswerFormat = 'Program Only' | 'Algorithm + Program + Output' | 'Complete Explanation';

export type QuestionType =
  | 'MCQ'
  | 'Very Short Answer'
  | 'Short Answer'
  | 'Coding Question'
  | 'Debugging Question'
  | 'Output Prediction'
  | 'Fill in the Blank'
  | 'Error Finding'
  | 'Conceptual Question'
  | 'Practical Question'
  | 'Assignment Question'
  | 'Viva Question';

export interface User {
  id: string;
  name: string;
  email: string;
  course: string;
  semester: number;
  college?: string;
  programmingLevel: SkillLevel;
  preferredLanguage: ProgrammingLanguage;
  role: 'student' | 'teacher' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  bio?: string;
  learningGoal?: string;
  currentStreak: number;
  current_streak?: number;
  longestStreak: number;
  longest_streak?: number;
  xp: number;
  level: number;
  total_points?: number;
}

export interface SyllabusTopic {
  id: string;
  unitId: string;
  title: string;
  topicOrder: number;
  isCompleted: boolean;
}

export interface SyllabusUnit {
  id: string;
  syllabusId: string;
  title: string;
  unitNumber: number;
  description?: string;
  topics: SyllabusTopic[];
}

export interface Syllabus {
  id: string;
  userId: string;
  course: string;
  semester: number;
  subject: string;
  language: ProgrammingLanguage;
  units: SyllabusUnit[];
  createdAt: string;
}

export interface ClarificationQuestion {
  id: string;
  question: string;
  options?: string[];
  fieldKey?: string;
}

export interface AssignmentResultData {
  id?: string;
  title?: string;
  needsClarification: boolean;
  clarificationQuestions?: ClarificationQuestion[];
  question: string;
  algorithm: string;
  code: string;
  explanation: string;
  sampleInput: string;
  sampleOutput: string;
  result: string;
  vivaQuestions: string[];
  commonMistakes: string[];
  importantConcepts: string[];
  language: ProgrammingLanguage;
  subject?: string;
  topic?: string;
  difficulty?: DifficultyLevel;
  isFavorite?: boolean;
  createdAt?: string;
}

export interface DoubtResponse {
  id?: string;
  question: string;
  answer: string;
  simpleExplanation: string;
  example: string;
  relatedConcepts: string[];
  language?: ProgrammingLanguage;
  createdAt?: string;
}

export interface DebuggerResponse {
  id?: string;
  hasError: boolean;
  errorType: string;
  problematicLines: number[];
  explanation: string;
  correctedCode: string;
  preventionTip: string;
  originalCode: string;
  language: ProgrammingLanguage;
  errorMessage?: string;
  createdAt?: string;
}

export interface PracticeQuestionItem {
  id: string;
  questionText: string;
  questionType: QuestionType;
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  score?: number;
  feedback?: string;
  explanation?: string;
  hint?: string;
  difficulty: DifficultyLevel;
  topic: string;
  starterCode?: string;
  sampleInput?: string;
  expectedOutput?: string;
  testCases?: any[];
}

export interface PracticeSession {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  language: ProgrammingLanguage;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  completedQuestions: number;
  score: number;
  accuracy: number;
  questions: PracticeQuestionItem[];
  createdAt: string;
}

export interface QuizQuestionItem {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  explanation: string;
  topic: string;
}

export interface QuizSession {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  totalQuestions: number;
  score: number;
  accuracy: number;
  timeLimitMinutes: number;
  timeTakenSeconds: number;
  questions: QuizQuestionItem[];
  recommendation?: string;
  createdAt: string;
}

export interface VivaTurn {
  id: string;
  examinerQuestion: string;
  studentAnswer?: string;
  evaluationFeedback?: string;
  score?: number;
  modelAnswer?: string;
  difficulty: DifficultyLevel;
}

export interface VivaSession {
  id: string;
  userId: string;
  subject: string;
  language: ProgrammingLanguage;
  topic: string;
  difficulty: DifficultyLevel;
  score: number;
  turns: VivaTurn[];
  currentTurnIndex: number;
  status: 'in_progress' | 'completed';
  strongTopics: string[];
  weakTopics: string[];
  preparationAdvice: string;
  createdAt: string;
}

export interface TopicProgress {
  topic: string;
  score: number;
  accuracy: number;
  attempts: number;
  correctAnswers: number;
  incorrectAnswers: number;
  lastPracticed: string;
  status: 'Strong' | 'Average' | 'Weak' | 'Very Weak';
  solved?: number;
}

export interface ProgressStats {
  totalQuestions: number;
  questionsSolved: number;
  correctAnswers: number;
  accuracy: number;
  doubtsCleared: number;
  practiceCompleted: number;
  quizAverageScore: number;
  vivaAverageScore: number;
  currentStreak: number;
  longestStreak: number;
  topicPerformance: TopicProgress[];
  weakTopics: TopicProgress[];
  recommendations: {
    topic: string;
    reason: string;
    difficulty: DifficultyLevel;
    action: string;
  }[];
  weeklyActivity: {
    day: string;
    questions: number;
    accuracy: number;
  }[];
}

export interface FavoriteItem {
  id: string;
  userId: string;
  resourceType: 'assignment' | 'doubt' | 'debug' | 'practice';
  resourceId: string;
  title: string;
  language: ProgrammingLanguage;
  details: string;
  createdAt: string;
}

export interface DownloadItem {
  id: string;
  userId: string;
  downloadType: 'assignment' | 'practice' | 'quiz' | 'viva';
  resourceId: string;
  title: string;
  format: 'PDF';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  isRead: boolean;
  is_read?: boolean;
  link?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  created_at?: string;
  conversation_id?: string;
}

export type DashboardAnalytics = ProgressStats;
export type DebugReport = DebuggerResponse;
export type PracticeQuestion = PracticeQuestionItem;
export type PracticeSessionResult = PracticeSession;

export interface DoubtItem {
  id: string;
  user_id: string;
  question: string;
  language: string;
  answer: string;
  simple_explanation: string;
  example: string;
  related_concepts: string[];
  created_at: string;
}

export interface VivaQuestion {
  id?: string;
  question: string;
  expectedAnswer: string;
  topic: string;
  difficulty?: string;
}

export interface HistoryItem {
  id: string;
  type: string;
  title: string;
  details: string;
  date: string;
  language?: ProgrammingLanguage;
  reference_id?: string;
}

export interface SyllabusData {
  course: string;
  semester: number;
  subject: string;
  units: {
    unitNumber: number;
    title: string;
    topics: { name: string; completed?: boolean }[];
  }[];
}

