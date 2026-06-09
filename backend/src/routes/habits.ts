import { Router, Request, Response } from 'express';
import {
  getHabitsBySession,
  getHabitsByDateRange,
  getHabitsSummary,
} from '../database/queries';
import type { Period } from '../types/index';

const router = Router();

router.get('/habits', (req: Request, res: Response) => {
  try {
    const { sessionId, period, start, end } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ error: 'El parámetro "sessionId" es requerido' });
      return;
    }

    if (start && end && typeof start === 'string' && typeof end === 'string') {
      const habits = getHabitsByDateRange(sessionId, start, end);
      res.json({ habits });
      return;
    }

    if (period && typeof period === 'string') {
      const now = new Date();
      let startDate: string;
      switch (period) {
        case 'week': {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          startDate = weekAgo.toISOString().slice(0, 10);
          break;
        }
        case 'month': {
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          startDate = monthAgo.toISOString().slice(0, 10);
          break;
        }
        default:
          startDate = now.toISOString().slice(0, 10);
      }
      const habits = getHabitsByDateRange(
        sessionId,
        startDate,
        now.toISOString().slice(0, 10)
      );
      res.json({ habits });
      return;
    }

    const habits = getHabitsBySession(sessionId);
    res.json({ habits });
  } catch (error) {
    console.error('Error en GET /api/habits:', error);
    res.status(500).json({ error: 'Error al obtener hábitos' });
  }
});

router.get('/habits/summary', (req: Request, res: Response) => {
  try {
    const { sessionId, period } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ error: 'El parámetro "sessionId" es requerido' });
      return;
    }

    const p: Period = (period as Period) || 'week';
    const summary = getHabitsSummary(sessionId, p);
    res.json({ summary });
  } catch (error) {
    console.error('Error en GET /api/habits/summary:', error);
    res.status(500).json({ error: 'Error al obtener resumen de hábitos' });
  }
});

export default router;
