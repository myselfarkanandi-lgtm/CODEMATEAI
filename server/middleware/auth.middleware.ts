import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbManager, DBUser } from '../db/database.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'codemate-ai-super-secure-jwt-secret-key-2026';

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  course: string;
  semester: number;
  programmingLevel: string;
  preferredLanguage: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function generateToken(user: DBUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      course: user.course,
      semester: user.semester,
      programmingLevel: user.programming_level,
      preferredLanguage: user.preferred_language,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed authorization token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;

    // Verify student exists in DB
    const db = dbManager.getRawData();
    const user = db.users.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User account no longer exists' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      course: user.course,
      semester: user.semester,
      programmingLevel: user.programming_level,
      preferredLanguage: user.preferred_language,
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
  }
}

export function requireRole(allowedRoles: ('student' | 'teacher' | 'admin')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions for this action' });
    }
    next();
  };
}
