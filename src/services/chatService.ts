import { API_BASE } from '../constants/api';
import type { ChatMessage } from '../types/index';

export async function sendMessage(
  message: string,
  sessionId?: string
): Promise<{ reply: string; sessionId: string }> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

export async function getHistory(
  sessionId: string
): Promise<{ messages: ChatMessage[] }> {
  const res = await fetch(`${API_BASE}/chat/history?sessionId=${sessionId}`);

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}
