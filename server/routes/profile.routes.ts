import { Router, Response } from 'express';
import { dbManager } from '../db/database.ts';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';

const router = Router();

// 1. Get profile
router.get('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const user = db.users.find((u) => u.id === userId);
  const profile = db.profiles.find((p) => p.user_id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      course: user.course,
      semester: user.semester,
      college: user.college,
      programmingLevel: user.programming_level,
      preferredLanguage: user.preferred_language,
      role: user.role,
      createdAt: user.created_at,
    },
    profile,
  });
});

// 2. Update profile
router.put('/', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const db = dbManager.getRawData();
  const user = db.users.find((u) => u.id === userId);
  let profile = db.profiles.find((p) => p.user_id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, college, course, semester, programmingLevel, preferredLanguage, bio, learningGoal } = req.body;

  if (name) user.name = name.trim();
  if (college !== undefined) user.college = college.trim();
  if (course) user.course = course.trim();
  if (semester) user.semester = Number(semester);
  if (programmingLevel) user.programming_level = programmingLevel;
  if (preferredLanguage) user.preferred_language = preferredLanguage;
  user.updated_at = new Date().toISOString();

  if (!profile) {
    profile = {
      id: 'prof_' + userId,
      user_id: userId,
      bio: bio || '',
      learning_goal: learningGoal || '',
      current_streak: 1,
      longest_streak: 1,
      xp: 100,
      level: 1,
    };
    db.profiles.push(profile);
  } else {
    if (bio !== undefined) profile.bio = bio;
    if (learningGoal !== undefined) profile.learning_goal = learningGoal;
  }

  dbManager.persist();

  return res.json({
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      course: user.course,
      semester: user.semester,
      college: user.college,
      programmingLevel: user.programming_level,
      preferredLanguage: user.preferred_language,
      role: user.role,
    },
    profile,
  });
});

export default router;
