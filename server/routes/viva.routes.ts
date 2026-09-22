import { Router, Response } from 'express';
import { dbManager, DBVivaSession } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';

const router = Router();

// 1. Save viva session
router.post('/sessions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const { subject, language, topic, difficulty, score, turns, strongTopics, weakTopics, preparationAdvice } = req.body;

  const newViva: DBVivaSession = {
    id: 'viva_' + Date.now(),
    user_id: userId,
    subject: subject || 'Computer Applications',
    language: language || req.user?.preferredLanguage || 'c',
    topic: topic || 'Core Programming',
    difficulty: difficulty || 'Intermediate',
    score: Number(score) || 0,
    turns: turns || [],
    status: 'completed',
    strong_topics: strongTopics || ['Syntax understanding', 'Basic algorithms'],
    weak_topics: weakTopics || ['Memory management', 'Edge case analysis'],
    preparation_advice: preparationAdvice || 'Practice writing out memory state diagrams before viva.',
    created_at: new Date().toISOString(),
  };

  db.viva_sessions.unshift(newViva);

  const profile = db.profiles.find((p) => p.user_id === userId);
  if (profile) {
    profile.xp += 100;
  }

  dbManager.persist();
  return res.status(201).json(newViva);
});

// 2. List viva sessions
router.get('/sessions', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const sessions = db.viva_sessions.filter((s) => s.user_id === userId);
  return res.json(sessions);
});

export default router;
