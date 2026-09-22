import { Router, Response } from 'express';
import { dbManager, DBFavorite } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';

const router = Router();

// 1. Get all favorites for authenticated user
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const favorites = db.favorites.filter((f) => f.user_id === userId);
  return res.json(favorites);
});

// 2. Add to favorites
router.post('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const { resourceType, resourceId, title, language, details } = req.body;

  if (!resourceId || !title) {
    return res.status(400).json({ error: 'Resource ID and title are required' });
  }

  const existing = db.favorites.find((f) => f.resource_id === resourceId && f.user_id === userId);
  if (existing) {
    return res.json({ message: 'Item is already in favorites', favorite: existing });
  }

  const newFav: DBFavorite = {
    id: 'fav_' + Date.now(),
    user_id: userId,
    resource_type: resourceType || 'assignment',
    resource_id: resourceId,
    title: title,
    language: language || 'c',
    details: details || '',
    created_at: new Date().toISOString(),
  };

  db.favorites.unshift(newFav);
  dbManager.persist();

  return res.status(201).json(newFav);
});

// 3. Remove from favorites
router.delete('/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const idx = db.favorites.findIndex(
    (f) => (f.id === req.params.id || f.resource_id === req.params.id) && f.user_id === userId
  );

  if (idx === -1) {
    return res.status(404).json({ error: 'Favorite not found' });
  }

  const removed = db.favorites.splice(idx, 1)[0];

  // If this was an assignment, toggle is_favorite to false
  if (removed.resource_type === 'assignment') {
    const asg = db.assignments.find((a) => a.id === removed.resource_id && a.user_id === userId);
    if (asg) {
      asg.is_favorite = false;
    }
  }

  dbManager.persist();
  return res.json({ message: 'Removed from favorites' });
});

export default router;
