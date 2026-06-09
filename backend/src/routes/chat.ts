import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { saveMessage, getMessagesBySession, getProfile } from '../database/queries';
import { processChatMessage } from '../services/gemini';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'El campo "message" es requerido' });
      return;
    }

    const sid = sessionId || uuidv4();

    saveMessage(sid, 'user', message);

    const profile = getProfile(sid);

    const reply = await processChatMessage(message, sid, profile);

    saveMessage(sid, 'assistant', reply);

    res.json({ reply, sessionId: sid });
  } catch (error) {
    console.error('Error en POST /api/chat:', error);
    res.status(500).json({ error: 'Error al procesar el mensaje' });
  }
});

router.get('/chat/history', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ error: 'El parámetro "sessionId" es requerido' });
      return;
    }

    const messages = getMessagesBySession(sessionId);
    res.json({ messages });
  } catch (error) {
    console.error('Error en GET /api/chat/history:', error);
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
});

export default router;
