import { Router, Response } from 'express';
import { dbManager, DBSyllabus, DBSyllabusUnit, DBSyllabusTopic } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';

const router = Router();

// 1. Get user's syllabus
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  let syllabus = db.syllabi.find((s) => s.user_id === userId);

  if (!syllabus) {
    // Create default starter syllabus for this student based on course and language
    const newSyllabus: DBSyllabus = {
      id: 'syl_' + Date.now(),
      user_id: userId,
      course: req.user?.course || 'BCA',
      semester: req.user?.semester || 1,
      subject: `${req.user?.preferredLanguage?.toUpperCase() || 'C'} Programming`,
      language: req.user?.preferredLanguage || 'c',
      created_at: new Date().toISOString(),
      units: [
        {
          id: 'unit_1_' + Date.now(),
          syllabus_id: 'syl_' + Date.now(),
          title: 'Unit 1 — Fundamentals & I/O',
          unit_number: 1,
          description: 'Program structure, tokens, variables, basic input and output',
          topics: [
            { id: 'top_1_1', unit_id: 'unit_1', title: 'Program Structure & Flow', topic_order: 1, is_completed: true },
            { id: 'top_1_2', unit_id: 'unit_1', title: 'Data Types & Variables', topic_order: 2, is_completed: false },
          ],
        },
        {
          id: 'unit_2_' + Date.now(),
          syllabus_id: 'syl_' + Date.now(),
          title: 'Unit 2 — Control Structures',
          unit_number: 2,
          description: 'Conditionals, loops, iteration and branching',
          topics: [
            { id: 'top_2_1', unit_id: 'unit_2', title: 'If-Else & Switch Statements', topic_order: 1, is_completed: false },
            { id: 'top_2_2', unit_id: 'unit_2', title: 'While & For Loops', topic_order: 2, is_completed: false },
          ],
        },
      ],
    };
    db.syllabi.push(newSyllabus);
    dbManager.persist();
    syllabus = newSyllabus;
  }

  return res.json(syllabus);
});

// 2. Add Unit to Syllabus
router.post('/units', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const syllabus = db.syllabi.find((s) => s.user_id === userId);

  if (!syllabus) {
    return res.status(404).json({ error: 'Syllabus not found' });
  }

  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Unit title is required' });
  }

  const newUnit: DBSyllabusUnit = {
    id: 'unit_' + Date.now(),
    syllabus_id: syllabus.id,
    title: title.trim(),
    unit_number: syllabus.units.length + 1,
    description: description || '',
    topics: [],
  };

  syllabus.units.push(newUnit);
  dbManager.persist();

  return res.status(201).json(syllabus);
});

// 3. Add Topic to Unit
router.post('/units/:unitId/topics', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const syllabus = db.syllabi.find((s) => s.user_id === userId);

  if (!syllabus) {
    return res.status(404).json({ error: 'Syllabus not found' });
  }

  const unit = syllabus.units.find((u) => u.id === req.params.unitId);
  if (!unit) {
    return res.status(404).json({ error: 'Unit not found' });
  }

  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Topic title is required' });
  }

  const newTopic: DBSyllabusTopic = {
    id: 'top_' + Date.now(),
    unit_id: unit.id,
    title: title.trim(),
    topic_order: unit.topics.length + 1,
    is_completed: false,
  };

  unit.topics.push(newTopic);
  dbManager.persist();

  return res.status(201).json(syllabus);
});

// 4. Toggle Topic Completion
router.patch('/topics/:topicId/toggle', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const syllabus = db.syllabi.find((s) => s.user_id === userId);

  if (!syllabus) {
    return res.status(404).json({ error: 'Syllabus not found' });
  }

  for (const unit of syllabus.units) {
    const topic = unit.topics.find((t) => t.id === req.params.topicId);
    if (topic) {
      topic.is_completed = !topic.is_completed;
      dbManager.persist();
      return res.json({ topic, syllabus });
    }
  }

  return res.status(404).json({ error: 'Topic not found' });
});

// 5. Delete Unit
router.delete('/units/:unitId', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const syllabus = db.syllabi.find((s) => s.user_id === userId);

  if (!syllabus) {
    return res.status(404).json({ error: 'Syllabus not found' });
  }

  const idx = syllabus.units.findIndex((u) => u.id === req.params.unitId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Unit not found' });
  }

  syllabus.units.splice(idx, 1);
  // Re-number remaining units
  syllabus.units.forEach((u, i) => {
    u.unit_number = i + 1;
  });

  dbManager.persist();
  return res.json(syllabus);
});

export default router;
