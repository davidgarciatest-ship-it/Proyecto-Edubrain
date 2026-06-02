import { useState, useCallback, useRef, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ChatMessage } from '../types/index';
import { sendMessage, getHistory } from '../services/chatService';

const SESSION_KEY = 'edubrain_session_id';

async function getStoredSessionId(): Promise<string | undefined> {
  try {
    return (await AsyncStorage.getItem(SESSION_KEY)) ?? undefined;
  } catch {
    return undefined;
  }
}

async function storeSessionId(id: string) {
  try {
    await AsyncStorage.setItem(SESSION_KEY, id);
  } catch {
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    getStoredSessionId().then((sid) => {
      sessionIdRef.current = sid;
    });
  }, []);

  const loadHistory = useCallback(async () => {
    const sid = sessionIdRef.current;
    if (!sid) return;

    try {
      const data = await getHistory(sid);
      setMessages(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar historial');
    }
  }, []);

  const send = useCallback(async (content: string) => {
    const sid = sessionIdRef.current;

    const userMessage: ChatMessage = {
      id: Date.now(),
      session_id: sid ?? '',
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendMessage(content, sid);
      sessionIdRef.current = data.sessionId;
      await storeSessionId(data.sessionId);

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        session_id: data.sessionId,
        role: 'assistant',
        content: data.reply,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar mensaje');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { messages, isLoading, error, send, loadHistory };
}
