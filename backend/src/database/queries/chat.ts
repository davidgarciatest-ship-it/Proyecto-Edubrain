import { run, prepare } from './_shared';
import type { ChatMessage } from '../../types/index';

export function saveMessage(sessionId: string, role: 'user' | 'assistant' | 'system', content: string): ChatMessage {
  const result = run('INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)', [sessionId, role, content]);
  return { id: result.lastInsertRowid, session_id: sessionId, role, content, created_at: new Date().toISOString() };
}

export function getMessagesBySession(sessionId: string): ChatMessage[] {
  return prepare<ChatMessage>('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC', [sessionId]);
}
