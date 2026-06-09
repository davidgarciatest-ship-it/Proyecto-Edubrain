import { Router, Request, Response } from 'express';
import { getProfile, upsertProfile } from '../database/queries';
import type { AcademicLevel } from '../types/index';

const router = Router();

router.get('/profile', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ error: 'El parámetro "sessionId" es requerido' });
      return;
    }

    const profile = getProfile(sessionId);
    if (!profile) {
      res.json({ profile: null });
      return;
    }

    res.json({
      profile: {
        ...profile,
        subjects: profile.subjects ? JSON.parse(profile.subjects) : [],
        goals: profile.goals ? JSON.parse(profile.goals) : [],
      },
    });
  } catch (error) {
    console.error('Error en GET /api/profile:', error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

router.put('/profile', (req: Request, res: Response) => {
  try {
    const { sessionId, academicLevel, school, subjects, goals } = req.body;

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ error: 'El campo "sessionId" es requerido' });
      return;
    }

    if (
      !academicLevel ||
      !['primaria', 'secundaria', 'universidad'].includes(academicLevel)
    ) {
      res.status(400).json({
        error: 'El campo "academicLevel" debe ser primaria, secundaria o universidad',
      });
      return;
    }

    const profile = upsertProfile(sessionId, {
      academicLevel: academicLevel as AcademicLevel,
      school,
      subjects,
      goals,
    });

    res.json({
      profile: {
        ...profile,
        subjects: profile.subjects ? JSON.parse(profile.subjects) : [],
        goals: profile.goals ? JSON.parse(profile.goals) : [],
      },
    });
  } catch (error) {
    console.error('Error en PUT /api/profile:', error);
    res.status(500).json({ error: 'Error al guardar el perfil' });
  }
});

export default router;
