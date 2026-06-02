import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './database/init';
import chatRoutes from './routes/chat';
import habitsRoutes from './routes/habits';
import profileRoutes from './routes/profile';
import remindersRoutes from './routes/reminders';

dotenv.config();

async function main() {
  await initDb();
  console.log('Base de datos SQLite inicializada');

  const app = express();
  const PORT = parseInt(process.env.PORT || '3001', 10);

  app.use(cors());
  app.use(express.json());

  app.use('/api', chatRoutes);
  app.use('/api', habitsRoutes);
  app.use('/api', profileRoutes);
  app.use('/api', remindersRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.listen(PORT, () => {
    console.log(`EduBrain backend corriendo en http://localhost:${PORT}`);
  });
}

main().catch(console.error);
