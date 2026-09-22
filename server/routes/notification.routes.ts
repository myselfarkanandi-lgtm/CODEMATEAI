import { Router, Response } from 'express';
import { dbManager } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';

const router = Router();

// 1. Get notifications
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const notifs = db.notifications.filter((n) => n.user_id === userId);
  return res.json(notifs);
});

// 2. Mark notification read
router.patch('/:id/read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const notif = db.notifications.find((n) => n.id === req.params.id && n.user_id === userId);

  if (notif) {
    notif.is_read = true;
    dbManager.persist();
  }

  return res.json({ message: 'Marked as read' });
});

// 3. Mark all read
router.patch('/mark-all-read', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  db.notifications.filter((n) => n.user_id === userId).forEach((n) => (n.is_read = true));
  dbManager.persist();
  return res.json({ message: 'All marked as read' });
});

export default router;
