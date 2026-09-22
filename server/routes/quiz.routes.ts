import { Router, Response } from 'express';
import { dbManager, DBQuiz } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';

const router = Router();

// 1. Submit completed quiz
router.post('/sessions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const { subject, topic, difficulty, totalQuestions, score, accuracy, timeTakenSeconds, questions, recommendation } =
    req.body;

  const newQuiz: DBQuiz = {
    id: 'quiz_' + Date.now(),
    user_id: userId,
    subject: subject || 'Computer Programming',
    topic: topic || 'General',
    difficulty: difficulty || 'Basic',
    total_questions: Number(totalQuestions) || questions?.length || 5,
    score: Number(score) || 0,
    accuracy: Number(accuracy) || 0,
    time_taken_seconds: Number(timeTakenSeconds) || 0,
    questions: questions || [],
    recommendation: recommendation || '',
    created_at: new Date().toISOString(),
  };

  db.quizzes.unshift(newQuiz);

  // Update progress for topic
  let prog = db.progress.find((p) => p.user_id === userId && p.topic.toLowerCase() === topic.toLowerCase());
  const correctCount = questions ? questions.filter((q: any) => q.isCorrect).length : Math.round((Number(score) / 100) * Number(totalQuestions));
  const attemptCount = Number(totalQuestions) || 5;

  if (prog) {
    prog.attempts += attemptCount;
    prog.correct_answers += correctCount;
    prog.incorrect_answers += attemptCount - correctCount;
    prog.accuracy = Math.round((prog.correct_answers / prog.attempts) * 100);
    prog.score = prog.accuracy;
    prog.last_practiced = new Date().toISOString();
  }

  // Award XP
  const profile = db.profiles.find((p) => p.user_id === userId);
  if (profile) {
    profile.xp += 60;
  }

  dbManager.persist();
  return res.status(201).json(newQuiz);
});

// 2. List student's completed quizzes
router.get('/sessions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const quizzes = db.quizzes.filter((q) => q.user_id === userId);
  return res.json(quizzes);
});

export default router;
