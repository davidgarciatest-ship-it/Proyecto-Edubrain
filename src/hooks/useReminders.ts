import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../constants/api';
import type { Reminder, ReminderType } from '../types/index';

const SESSION_KEY = 'edubrain_session_id';

interface CreateReminderData {
  title: string;
  reminderType: ReminderType;
  scheduledTime: string;
  repeatDays?: number[];
}

async function getSessionId(): Promise<string | undefined> {
  try {
    return (await AsyncStorage.getItem(SESSION_KEY)) ?? undefined;
  } catch {
    return undefined;
  }
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReminders = useCallback(async () => {
    const sid = await getSessionId();
    if (!sid) return;

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/reminders?sessionId=${sid}`);
      if (!res.ok) throw new Error('Error al cargar recordatorios');
      const data = await res.json();
      setReminders(data.reminders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar recordatorios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReminder = useCallback(async (data: CreateReminderData) => {
    const sid = await getSessionId();
    if (!sid) {
      setError('No hay sesión activa. Envía un mensaje en el chat primero.');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, ...data }),
      });
      if (!res.ok) throw new Error('Error al crear recordatorio');
      const result = await res.json();
      setReminders((prev) => [...prev, result.reminder]);
      return result.reminder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear recordatorio');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleReminder = useCallback(async (id: number, enabled: number) => {
    try {
      const res = await fetch(`${API_BASE}/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) throw new Error('Error al actualizar recordatorio');
      const result = await res.json();
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? result.reminder : r))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar recordatorio');
    }
  }, []);

  const deleteReminder = useCallback(async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/reminders/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar recordatorio');
      setReminders((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar recordatorio');
    }
  }, []);

  return { reminders, isLoading, error, loadReminders, createReminder, toggleReminder, deleteReminder };
}
