import { Router, Response } from 'express';
import { dbManager } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';

const router = Router();

// Get unified student history
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const filterType = (req.query.type as string)?.toLowerCase();
  const search = (req.query.search as string)?.toLowerCase();

  const assignments = db.assignments
    .filter((a) => a.user_id === userId)
    .map((a) => ({
      id: a.id,
      type: 'assignment',
      title: a.question,
      language: a.language,
      topic: a.topic,
      date: a.created_at,
      details: `${a.purpose} • ${a.difficulty}`,
      isFavorite: a.is_favorite,
      link: `/assignment/${a.id}`,
    }));

  const doubts = db.doubts
    .filter((d) => d.user_id === userId)
    .map((d) => ({
      id: d.id,
      type: 'doubt',
      title: d.question,
      language: d.language,
      topic: 'Doubt Cleared',
      date: d.created_at,
      details: d.simple_explanation.slice(0, 80) + '...',
      isFavorite: false,
      link: `/doubt-solver`,
    }));

  const debugs = db.debug_sessions
    .filter((d) => d.user_id === userId)
    .map((d) => ({
      id: d.id,
      type: 'debugger',
      title: d.error_type || 'Debug Session',
      language: d.language,
      topic: 'Code Debug',
      date: d.created_at,
      details: d.has_error ? `Issue on line ${d.problematic_lines?.join(', ') || 'unknown'}` : 'Clean Code',
      isFavorite: false,
      link: `/debugger`,
    }));

  const practices = db.practice_sessions
    .filter((p) => p.user_id === userId)
    .map((p) => ({
      id: p.id,
      type: 'practice',
      title: `Practice: ${p.topic}`,
      language: p.language,
      topic: p.topic,
      date: p.created_at,
      details: `Score: ${p.score}% • ${p.completed_questions}/${p.total_questions} Questions`,
      isFavorite: false,
      link: `/practice`,
    }));

  let combined = [...assignments, ...doubts, ...debugs, ...practices].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (filterType && filterType !== 'all') {
    combined = combined.filter((item) => item.type === filterType);
  }
  if (search) {
    combined = combined.filter(
      (item) => item.title.toLowerCase().includes(search) || item.topic.toLowerCase().includes(search)
    );
  }

  return res.json(combined);
});

export default router;
