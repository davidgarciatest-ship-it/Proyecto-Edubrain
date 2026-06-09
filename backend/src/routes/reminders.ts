import { Router, Request, Response } from 'express';
import { getReminders, createReminder, updateReminder, deleteReminder } from '../database/queries';

const router = Router();

router.get('/reminders', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId || typeof sessionId !== 'string') { res.status(400).json({ error: 'sessionId requerido' }); return }
    res.json({ reminders: getReminders(sessionId) });
  } catch (e) { console.error('GET /api/reminders:', e); res.status(500).json({ error: 'Error al obtener recordatorios' }) }
});

router.post('/reminders', (req: Request, res: Response) => {
  try {
    const b = req.body as any;
    if (!b.sessionId || typeof b.sessionId !== 'string') { res.status(400).json({ error: 'sessionId requerido' }); return }
    if (!b.title || typeof b.title !== 'string') { res.status(400).json({ error: 'title requerido' }); return }
    if (!b.reminderType || !['study', 'meal', 'goal'].includes(b.reminderType)) { res.status(400).json({ error: 'reminderType debe ser study, meal o goal' }); return }
    if (!b.scheduledTime || typeof b.scheduledTime !== 'string') { res.status(400).json({ error: 'scheduledTime requerido' }); return }
    const reminder = createReminder(b.sessionId, { title: b.title, reminderType: b.reminderType, scheduledTime: b.scheduledTime, repeatDays: b.repeatDays });
    res.status(201).json({ reminder });
  } catch (e) { console.error('POST /api/reminders:', e); res.status(500).json({ error: 'Error al crear recordatorio' }) }
});

router.put('/reminders/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID inválido' }); return }
    const b = req.body as any;
    const reminder = updateReminder(id, { title: b.title, reminderType: b.reminderType, scheduledTime: b.scheduledTime, repeatDays: b.repeatDays, enabled: b.enabled });
    if (!reminder) { res.status(404).json({ error: 'Recordatorio no encontrado' }); return }
    res.json({ reminder });
  } catch (e) { console.error('PUT /api/reminders/:id:', e); res.status(500).json({ error: 'Error al actualizar recordatorio' }) }
});

router.delete('/reminders/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) { res.status(400).json({ error: 'ID inválido' }); return }
    if (!deleteReminder(id)) { res.status(404).json({ error: 'Recordatorio no encontrado' }); return }
    res.json({ success: true });
  } catch (e) { console.error('DELETE /api/reminders/:id:', e); res.status(500).json({ error: 'Error al eliminar recordatorio' }) }
});

export default router;
