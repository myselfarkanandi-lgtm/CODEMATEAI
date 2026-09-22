import { Router, Response } from 'express';
import { dbManager, DBPracticeSession, DBProgress } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';

const router = Router();

// 1. Save completed practice session
router.post('/sessions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const { subject, topic, language, difficulty, totalQuestions, completedQuestions, score, accuracy, questions } =
    req.body;

  const newSession: DBPracticeSession = {
    id: 'prac_' + Date.now(),
    user_id: userId,
    subject: subject || 'Computer Applications',
    topic: topic || 'Core Programming',
    language: language || req.user?.preferredLanguage || 'c',
    difficulty: difficulty || 'Basic',
    total_questions: Number(totalQuestions) || questions?.length || 1,
    completed_questions: Number(completedQuestions) || questions?.length || 1,
    score: Number(score) || 0,
    accuracy: Number(accuracy) || 0,
    questions: questions || [],
    created_at: new Date().toISOString(),
  };

  db.practice_sessions.unshift(newSession);

  // Update or insert topic progress in DB
  let prog = db.progress.find((p) => p.user_id === userId && p.topic.toLowerCase() === topic.toLowerCase());
  const correctCount = questions ? questions.filter((q: any) => q.isCorrect).length : Math.round((Number(score) / 100) * Number(totalQuestions));
  const attemptCount = Number(totalQuestions) || 1;
  const incorrectCount = attemptCount - correctCount;

  if (prog) {
    prog.attempts += attemptCount;
    prog.correct_answers += correctCount;
    prog.incorrect_answers += incorrectCount;
    prog.accuracy = Math.round((prog.correct_answers / prog.attempts) * 100);
    prog.score = prog.accuracy;
    prog.last_practiced = new Date().toISOString();
    prog.updated_at = new Date().toISOString();
  } else {
    prog = {
      id: 'prog_' + Date.now(),
      user_id: userId,
      topic: topic,
      score: Number(accuracy) || 0,
      accuracy: Number(accuracy) || 0,
      attempts: attemptCount,
      correct_answers: correctCount,
      incorrect_answers: incorrectCount,
      last_practiced: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.progress.push(prog);
  }

  // Award XP and increment streak in profile
  const profile = db.profiles.find((p) => p.user_id === userId);
  if (profile) {
    profile.xp += 50;
  }

  dbManager.persist();

  // Calculate adaptive difficulty recommendation
  let nextDifficulty = difficulty;
  let adaptiveFeedback = '';
  if (prog.accuracy >= 80) {
    nextDifficulty = difficulty === 'Basic' ? 'Intermediate' : 'Advanced';
    adaptiveFeedback = `High mastery achieved (${prog.accuracy}% accuracy)! Recommending stepping up to ${nextDifficulty}.`;
  } else if (prog.accuracy >= 60) {
    adaptiveFeedback = `Solid performance (${prog.accuracy}%). Consolidate at current ${difficulty} level.`;
  } else {
    nextDifficulty = 'Basic';
    adaptiveFeedback = `Accuracy is currently ${prog.accuracy}%. Providing fundamental remedial practice to strengthen foundations.`;
  }

  return res.status(201).json({
    session: newSession,
    progress: prog,
    adaptiveRecommendation: {
      nextDifficulty,
      adaptiveFeedback,
    },
  });
});

// 2. List student's practice sessions
router.get('/sessions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const sessions = db.practice_sessions.filter((s) => s.user_id === userId);
  return res.json(sessions);
});

export default router;
