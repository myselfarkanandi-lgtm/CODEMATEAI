import { Router, Response } from 'express';
import { dbManager, DBAssignment, DBFavorite } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';
import { geminiService } from '../services/gemini.service.ts';

const router = Router();

// 1. Generate or Save Assignment
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      question,
      language,
      course,
      semester,
      subject,
      topic,
      purpose,
      difficulty,
      answerFormat,
      existingCode,
      collegeFormat,
      languagePreference,
      forceGenerate,
      saveDirectly,
      solutionData,
    } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question text is required' });
    }

    // If saving pre-approved or generated solution
    if (saveDirectly && solutionData) {
      const db = dbManager.getRawData();
      const assignmentId = 'asg_' + Date.now();
      const newAssignment: DBAssignment = {
        id: assignmentId,
        user_id: userId,
        question: question.trim(),
        language: solutionData.language || language || 'c',
        subject: subject || 'Computer Programming',
        topic: topic || 'General',
        purpose: purpose || 'Assignment',
        difficulty: difficulty || 'Basic',
        answer_format: answerFormat || 'Algorithm + Program + Output',
        algorithm: solutionData.algorithm || '',
        code: solutionData.code || '',
        explanation: solutionData.explanation || '',
        sample_input: solutionData.sampleInput || '',
        sample_output: solutionData.sampleOutput || '',
        result: solutionData.result || 'Executed successfully',
        viva_questions: solutionData.vivaQuestions || [],
        common_mistakes: solutionData.commonMistakes || [],
        important_concepts: solutionData.importantConcepts || [],
        is_favorite: false,
        created_at: new Date().toISOString(),
      };

      db.assignments.unshift(newAssignment);
      dbManager.persist();
      return res.status(201).json({ message: 'Assignment saved', assignment: newAssignment });
    }

    // Call Gemini AI service
    const result = await geminiService.generateAssignment({
      question,
      language: language || req.user?.preferredLanguage,
      course: course || req.user?.course,
      semester: semester || req.user?.semester,
      subject,
      topic,
      purpose,
      difficulty,
      answerFormat,
      existingCode,
      collegeFormat,
      languagePreference,
      forceGenerate: Boolean(forceGenerate),
    });

    // If no clarification needed and user wants it saved automatically
    if (!result.needsClarification) {
      const db = dbManager.getRawData();
      const assignmentId = 'asg_' + Date.now();
      const newAssignment: DBAssignment = {
        id: assignmentId,
        user_id: userId,
        question: question.trim(),
        language: language || req.user?.preferredLanguage || 'c',
        subject: subject || 'Computer Applications',
        topic: topic || 'Core Programming',
        purpose: purpose || 'Assignment',
        difficulty: difficulty || 'Basic',
        answer_format: answerFormat || 'Algorithm + Program + Output',
        algorithm: result.algorithm,
        code: result.code,
        explanation: result.explanation,
        sample_input: result.sampleInput,
        sample_output: result.sampleOutput,
        result: result.result,
        viva_questions: result.vivaQuestions,
        common_mistakes: result.commonMistakes,
        important_concepts: result.importantConcepts,
        is_favorite: false,
        created_at: new Date().toISOString(),
      };

      db.assignments.unshift(newAssignment);
      dbManager.persist();

      return res.status(201).json({
        ...result,
        id: assignmentId,
        isFavorite: false,
      });
    }

    return res.json(result);
  } catch (err: any) {
    console.error('Assignment generation error:', err);
    return res.status(500).json({ error: 'Failed to process assignment. ' + (err.message || '') });
  }
});

// 2. List authenticated user's assignments (Data Isolation enforced!)
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const search = (req.query.search as string)?.toLowerCase();
  const language = req.query.language as string;
  const topic = req.query.topic as string;

  let list = db.assignments.filter((a) => a.user_id === userId);

  if (search) {
    list = list.filter((a) => a.question.toLowerCase().includes(search) || a.topic.toLowerCase().includes(search));
  }
  if (language && language !== 'all') {
    list = list.filter((a) => a.language.toLowerCase() === language.toLowerCase());
  }
  if (topic && topic !== 'all') {
    list = list.filter((a) => a.topic.toLowerCase() === topic.toLowerCase());
  }

  return res.json(list);
});

// 3. Get single assignment by ID (User data isolation verified!)
router.get('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const item = db.assignments.find((a) => a.id === req.params.id && a.user_id === userId);

  if (!item) {
    return res.status(404).json({ error: 'Assignment not found or unauthorized' });
  }

  // Load any related conversation messages
  const convo = db.conversations.find((c) => c.context_id === item.id && c.user_id === userId);
  const messages = convo ? db.messages.filter((m) => m.conversation_id === convo.id) : [];

  return res.json({ assignment: item, conversation: messages });
});

// 4. Toggle Favorite
router.post('/:id/favorite', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const item = db.assignments.find((a) => a.id === req.params.id && a.user_id === userId);

  if (!item) {
    return res.status(404).json({ error: 'Assignment not found or unauthorized' });
  }

  item.is_favorite = !item.is_favorite;

  // Sync with favorites table
  const existingFavIndex = db.favorites.findIndex((f) => f.resource_id === item.id && f.user_id === userId);
  if (item.is_favorite) {
    if (existingFavIndex === -1) {
      db.favorites.unshift({
        id: 'fav_' + Date.now(),
        user_id: userId,
        resource_type: 'assignment',
        resource_id: item.id,
        title: item.question,
        language: item.language,
        details: item.topic + ' — ' + item.purpose,
        created_at: new Date().toISOString(),
      });
    }
  } else {
    if (existingFavIndex !== -1) {
      db.favorites.splice(existingFavIndex, 1);
    }
  }

  dbManager.persist();
  return res.json({ message: 'Favorite status updated', isFavorite: item.is_favorite });
});

// 5. Delete Assignment
router.delete('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const idx = db.assignments.findIndex((a) => a.id === req.params.id && a.user_id === userId);

  if (idx === -1) {
    return res.status(404).json({ error: 'Assignment not found or unauthorized' });
  }

  db.assignments.splice(idx, 1);
  // Also clean up favorites
  db.favorites = db.favorites.filter((f) => !(f.resource_id === req.params.id && f.user_id === userId));
  dbManager.persist();

  return res.json({ message: 'Assignment deleted successfully' });
});

// 6. Follow-up Chat on Assignment
router.post('/:id/follow-up', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const db = dbManager.getRawData();
    const item = db.assignments.find((a) => a.id === req.params.id && a.user_id === userId);

    if (!item) {
      return res.status(404).json({ error: 'Assignment not found or unauthorized' });
    }

    const { message, languagePreference } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // Get or create conversation
    let convo = db.conversations.find((c) => c.context_id === item.id && c.user_id === userId);
    if (!convo) {
      convo = {
        id: 'convo_' + Date.now(),
        user_id: userId,
        title: 'Follow-up on: ' + item.question.slice(0, 40),
        context_type: 'assignment',
        context_id: item.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.conversations.push(convo);
    }

    const history = db.messages.filter((m) => m.conversation_id === convo.id);

    // Save user message
    const userMsg = {
      id: 'msg_' + Date.now(),
      conversation_id: convo.id,
      role: 'user' as const,
      content: message,
      created_at: new Date().toISOString(),
    };
    db.messages.push(userMsg);

    // Get response from Gemini
    const contextContent = `Question: ${item.question}\nCode:\n${item.code}\nAlgorithm:\n${item.algorithm}\nExplanation:\n${item.explanation}`;
    const aiResponse = await geminiService.followUpChat({
      contextType: 'assignment',
      contextContent,
      messages: history.map((h) => ({ role: h.role, content: h.content })),
      newMessage: message,
      languagePreference,
    });

    const assistantMsg = {
      id: 'msg_' + (Date.now() + 1),
      conversation_id: convo.id,
      role: 'assistant' as const,
      content: aiResponse,
      created_at: new Date().toISOString(),
    };
    db.messages.push(assistantMsg);
    convo.updated_at = new Date().toISOString();
    dbManager.persist();

    return res.json({ reply: aiResponse, messages: [userMsg, assistantMsg] });
  } catch (err: any) {
    console.error('Follow-up error:', err);
    return res.status(500).json({ error: 'Failed to process follow-up' });
  }
});

export default router;
