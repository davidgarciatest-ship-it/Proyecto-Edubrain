import { run, prepare, getOne } from './_shared';
import type { Reminder, ReminderType } from '../../types/index';

export function getReminders(sessionId: string): Reminder[] {
  return prepare<Reminder>('SELECT * FROM reminders WHERE session_id = ? ORDER BY created_at DESC', [sessionId]);
}

export function createReminder(sessionId: string, data: {
  title: string; reminderType: ReminderType; scheduledTime: string; repeatDays?: number[];
}): Reminder {
  const result = run('INSERT INTO reminders (session_id, title, reminder_type, scheduled_time, repeat_days) VALUES (?, ?, ?, ?, ?)',
    [sessionId, data.title, data.reminderType, data.scheduledTime, data.repeatDays ? JSON.stringify(data.repeatDays) : null]);
  return {
    id: result.lastInsertRowid, session_id: sessionId, title: data.title, reminder_type: data.reminderType,
    scheduled_time: data.scheduledTime, repeat_days: data.repeatDays ? JSON.stringify(data.repeatDays) : null,
    enabled: 1, created_at: new Date().toISOString(),
  };
}

export function updateReminder(id: number, data: Partial<{
  title: string; reminderType: ReminderType; scheduledTime: string; repeatDays: string | null; enabled: number;
}>): Reminder | undefined {
  const fields: string[] = [];
  const values: (string | number | null | Uint8Array)[] = [];
  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.reminderType !== undefined) { fields.push('reminder_type = ?'); values.push(data.reminderType); }
  if (data.scheduledTime !== undefined) { fields.push('scheduled_time = ?'); values.push(data.scheduledTime); }
  if (data.repeatDays !== undefined) { fields.push('repeat_days = ?'); values.push(data.repeatDays); }
  if (data.enabled !== undefined) { fields.push('enabled = ?'); values.push(data.enabled); }
  if (fields.length === 0) return undefined;
  values.push(id);
  run(`UPDATE reminders SET ${fields.join(', ')} WHERE id = ?`, values);
  return getOne<Reminder>('SELECT * FROM reminders WHERE id = ?', [id]);
}

export function deleteReminder(id: number): boolean {
  return run('DELETE FROM reminders WHERE id = ?', [id]).changes > 0;
}
