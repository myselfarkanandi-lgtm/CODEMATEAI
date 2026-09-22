import { Router, Response } from 'express';
import { dbManager, DBDownload } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';

const router = Router();

// 1. Get downloads list for authenticated student
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const downloads = db.downloads.filter((d) => d.user_id === userId);
  return res.json(downloads);
});

// 2. Record a download event
router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const { downloadType, resourceId, title, format } = req.body;

  const item: DBDownload = {
    id: 'dl_' + Date.now(),
    user_id: userId,
    download_type: downloadType || 'assignment',
    resource_id: resourceId || 'res_' + Date.now(),
    title: title || 'CodeMate AI Report',
    format: format || 'PDF',
    created_at: new Date().toISOString(),
  };

  db.downloads.unshift(item);
  dbManager.persist();
  return res.status(201).json(item);
});

export default router;
