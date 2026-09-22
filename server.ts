import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

import authRoutes from './server/routes/auth.routes.ts';
import assignmentRoutes from './server/routes/assignment.routes.ts';
import aiRoutes from './server/routes/ai.routes.ts';
import syllabusRoutes from './server/routes/syllabus.routes.ts';
import practiceRoutes from './server/routes/practice.routes.ts';
import quizRoutes from './server/routes/quiz.routes.ts';
import vivaRoutes from './server/routes/viva.routes.ts';
import progressRoutes from './server/routes/progress.routes.ts';
import historyRoutes from './server/routes/history.routes.ts';
import favoritesRoutes from './server/routes/favorites.routes.ts';
import downloadsRoutes from './server/routes/downloads.routes.ts';
import profileRoutes from './server/routes/profile.routes.ts';
import notificationRoutes from './server/routes/notification.routes.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'CodeMate AI',
      timestamp: new Date().toISOString(),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/assignments', assignmentRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/syllabus', syllabusRoutes);
  app.use('/api/practice', practiceRoutes);
  app.use('/api/quiz', quizRoutes);
  app.use('/api/viva', vivaRoutes);
  app.use('/api/progress', progressRoutes);
  app.use('/api/history', historyRoutes);
  app.use('/api/favorites', favoritesRoutes);
  app.use('/api/downloads', downloadsRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Global API error handler
  app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('API Error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CodeMate AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
