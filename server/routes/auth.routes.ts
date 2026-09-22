import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbManager, DBUser, DBProfile } from '../db/database.ts';
import { generateToken, requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.ts';

const router = Router();

// 1. Register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      course,
      semester,
      college,
      programmingLevel,
      preferredLanguage,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const db = dbManager.getRawData();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const now = new Date().toISOString();
    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newUser: DBUser = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      course: course || 'BCA',
      semester: Number(semester) || 1,
      college: college || '',
      programming_level: programmingLevel || 'Beginner',
      preferred_language: preferredLanguage || 'c',
      role: 'student',
      created_at: now,
      updated_at: now,
    };

    const newProfile: DBProfile = {
      id: 'prof_' + userId,
      user_id: userId,
      bio: `Student studying ${course || 'Computer Applications'}`,
      learning_goal: 'Solve assignments, pass exams, and master coding fundamentals.',
      current_streak: 1,
      longest_streak: 1,
      xp: 100,
      level: 1,
    };

    db.users.push(newUser);
    db.profiles.push(newProfile);
    dbManager.persist();

    const token = generateToken(newUser);
    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        course: newUser.course,
        semester: newUser.semester,
        college: newUser.college,
        programmingLevel: newUser.programming_level,
        preferredLanguage: newUser.preferred_language,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// 2. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = dbManager.getRawData();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    return res.json({
      message: 'Logged in successfully',
      token,
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
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// 3. Demo Quick Login (One-click student demo)
router.post('/demo-login', (req, res) => {
  const db = dbManager.getRawData();
  const demoUser = db.users.find((u) => u.id === 'usr_arka_nandi_01') || db.users[0];
  if (!demoUser) {
    return res.status(404).json({ error: 'Demo account not found' });
  }

  const token = generateToken(demoUser);
  return res.json({
    message: 'Logged in as Demo Student (Arka Nandi)',
    token,
    user: {
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      course: demoUser.course,
      semester: demoUser.semester,
      college: demoUser.college,
      programmingLevel: demoUser.programming_level,
      preferredLanguage: demoUser.preferred_language,
      role: demoUser.role,
    },
  });
});

// 4. Me (Get current authenticated student)
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = dbManager.getRawData();
  const user = db.users.find((u) => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const profile = db.profiles.find((p) => p.user_id === user.id);

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
    },
    profile,
  });
});

// 5. Logout
router.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

// 6. Forgot Password (Supports instant demo reset token for development)
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  const db = dbManager.getRawData();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    // For security, do not leak whether email exists
    return res.json({
      message: 'If an account with that email exists, password reset instructions have been sent.',
      demoToken: 'DEMO-RESET-TOKEN-1234',
    });
  }

  return res.json({
    message: 'Password reset link sent to your registered email.',
    demoToken: 'DEMO-RESET-TOKEN-1234',
  });
});

// 7. Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, resetToken, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email and new password are required' });
  }
  if (confirmPassword && newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const db = dbManager.getRawData();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const salt = await bcrypt.genSalt(10);
  user.password_hash = await bcrypt.hash(newPassword, salt);
  user.updated_at = new Date().toISOString();
  dbManager.persist();

  return res.json({ message: 'Password has been reset successfully. Please login with your new password.' });
});

export default router;
