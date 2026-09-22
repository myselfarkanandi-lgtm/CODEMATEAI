import { Router, Response } from 'express';
import { dbManager, DBDoubt, DBDebugSession } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';
import { geminiService } from '../services/gemini.service.ts';

const router = Router();

// 1. Status: Check Gemini API status (Demo vs Real)
router.get('/status', (req, res) => {
  return res.json({
    isUsingRealGemini: geminiService.isUsingRealGemini(),
    modelName: geminiService.getModelName(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// 2. Doubt Solver: Ask a programming doubt
router.post('/doubt', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { question, language, languagePreference } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Doubt question is required' });
    }

    const studentContext = `${req.user?.course} Semester ${req.user?.semester}, ${req.user?.programmingLevel} in ${language || req.user?.preferredLanguage}`;
    const result = await geminiService.askDoubt({
      question,
      language: language || req.user?.preferredLanguage || 'c',
      studentContext,
      languagePreference,
    });

    // Store in doubts history
    const db = dbManager.getRawData();
    const doubtItem: DBDoubt = {
      id: 'dbt_' + Date.now(),
      user_id: userId,
      question: question.trim(),
      language: language || req.user?.preferredLanguage || 'c',
      answer: result.answer,
      simple_explanation: result.simpleExplanation,
      example: result.example,
      related_concepts: result.relatedConcepts,
      created_at: new Date().toISOString(),
    };
    db.doubts.unshift(doubtItem);

    // Increment doubts cleared count in stats or profile
    const profile = db.profiles.find((p) => p.user_id === userId);
    if (profile) {
      profile.xp += 20;
    }

    dbManager.persist();
    return res.json({ ...result, id: doubtItem.id });
  } catch (err: any) {
    console.error('Doubt error:', err);
    return res.status(500).json({ error: 'Failed to solve doubt' });
  }
});

// 3. Code Debugger: Analyze code and return fixes
router.post('/debug', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { code, language, errorMessage, question } = req.body;

    if (!code || code.trim() === '') {
      return res.status(400).json({ error: 'Source code is required for debugging' });
    }

    const result = await geminiService.debugCode({
      code,
      language: language || req.user?.preferredLanguage || 'c',
      errorMessage,
      question,
    });

    const db = dbManager.getRawData();
    const debugItem: DBDebugSession = {
      id: 'dbg_' + Date.now(),
      user_id: userId,
      language: language || req.user?.preferredLanguage || 'c',
      code,
      error_message: errorMessage || '',
      has_error: result.hasError,
      error_type: result.errorType,
      problematic_lines: result.problematicLines,
      explanation: result.explanation,
      corrected_code: result.correctedCode,
      prevention_tip: result.preventionTip,
      created_at: new Date().toISOString(),
    };
    db.debug_sessions.unshift(debugItem);

    const profile = db.profiles.find((p) => p.user_id === userId);
    if (profile) {
      profile.xp += 30;
    }

    dbManager.persist();
    return res.json({ ...result, id: debugItem.id });
  } catch (err: any) {
    console.error('Debug error:', err);
    return res.status(500).json({ error: 'Failed to debug code' });
  }
});

// 4. Practice Question Generation
router.post('/practice', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subject, topic, language, difficulty, questionType, count } = req.body;

    const questions = await geminiService.generatePracticeQuestions({
      subject: subject || 'Computer Applications',
      topic: topic || 'Loops',
      language: language || req.user?.preferredLanguage || 'c',
      difficulty: difficulty || 'Basic',
      questionType: questionType || 'MCQ',
      count: Number(count) || 3,
    });

    return res.json({ questions });
  } catch (err: any) {
    console.error('Practice gen error:', err);
    return res.status(500).json({ error: 'Failed to generate practice questions' });
  }
});

// 5. Quiz Generation
router.post('/quiz', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subject, topic, difficulty, questionCount } = req.body;

    const questions = await geminiService.generateQuiz({
      subject: subject || 'Computer Applications',
      topic: topic || 'Operators',
      difficulty: difficulty || 'Basic',
      questionCount: Number(questionCount) || 5,
    });

    return res.json({ questions });
  } catch (err: any) {
    console.error('Quiz gen error:', err);
    return res.status(500).json({ error: 'Failed to generate quiz' });
  }
});

// 6. Viva Trainer Turn
router.post('/viva', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subject, language, topic, difficulty, turnNumber, previousQuestion, studentAnswer } = req.body;

    const turn = await geminiService.getVivaNextTurn({
      subject: subject || 'Computer Programming',
      language: language || req.user?.preferredLanguage || 'c',
      topic: topic || 'Core Concepts',
      difficulty: difficulty || 'Basic',
      turnNumber: Number(turnNumber) || 1,
      previousQuestion,
      studentAnswer,
    });

    return res.json(turn);
  } catch (err: any) {
    console.error('Viva turn error:', err);
    return res.status(500).json({ error: 'Failed to generate viva response' });
  }
});

// 7. Practice Answer Evaluation
router.post('/evaluate', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { questionText, userAnswer, correctAnswer, difficulty, topic } = req.body;

    if (!userAnswer) {
      return res.status(400).json({ error: 'User answer is required for evaluation' });
    }

    const evaluation = await geminiService.evaluatePracticeAnswer({
      questionText,
      userAnswer,
      correctAnswer: correctAnswer || '',
      difficulty: difficulty || 'Basic',
      topic: topic || 'General',
    });

    return res.json(evaluation);
  } catch (err: any) {
    console.error('Evaluation error:', err);
    return res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});

export default router;
