import { run, prepare, getOne } from './_shared';
import type { HabitLog, HabitType, Period, HabitsSummary } from '../../types/index';

export function saveHabit(sessionId: string, habitType: HabitType, description: string, opts?: {
  subject?: string; durationMinutes?: number; mealType?: string; foods?: string; registeredAt?: string;
}): HabitLog {
  const registeredAt = opts?.registeredAt ?? new Date().toISOString().slice(0, 10);
  const result = run(
    'INSERT INTO habit_log (session_id, habit_type, description, subject, duration_minutes, meal_type, foods, registered_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [sessionId, habitType, description, opts?.subject ?? null, opts?.durationMinutes ?? null, opts?.mealType ?? null, opts?.foods ?? null, registeredAt]
  );
  return {
    id: result.lastInsertRowid, session_id: sessionId, habit_type: habitType, description,
    subject: opts?.subject ?? null, duration_minutes: opts?.durationMinutes ?? null,
    meal_type: opts?.mealType ?? null, foods: opts?.foods ?? null, registered_at: registeredAt, created_at: new Date().toISOString(),
  };
}

export function getHabitsBySession(sessionId: string): HabitLog[] {
  return prepare<HabitLog>('SELECT * FROM habit_log WHERE session_id = ? ORDER BY created_at DESC', [sessionId]);
}

export function getHabitsByDateRange(sessionId: string, start: string, end: string): HabitLog[] {
  return prepare<HabitLog>('SELECT * FROM habit_log WHERE session_id = ? AND registered_at BETWEEN ? AND ? ORDER BY created_at DESC', [sessionId, start, end]);
}

export function getHabitsSummary(sessionId: string, period: Period): HabitsSummary {
  const now = new Date();
  let startDate: string;
  switch (period) {
    case 'day': startDate = now.toISOString().slice(0, 10); break;
    case 'week': { const d = new Date(now); d.setDate(d.getDate() - 7); startDate = d.toISOString().slice(0, 10); break; }
    case 'month': { const d = new Date(now); d.setMonth(d.getMonth() - 1); startDate = d.toISOString().slice(0, 10); break; }
  }
  const meals = prepare<{ count: number; meal_type: string | null }>(
    "SELECT COUNT(*) as count, meal_type FROM habit_log WHERE session_id = ? AND habit_type = 'meal' AND registered_at >= ? GROUP BY meal_type",
    [sessionId, startDate]
  );
  const studyRow = getOne<{ count: number; total_minutes: number }>(
    "SELECT COUNT(*) as count, COALESCE(SUM(duration_minutes), 0) as total_minutes FROM habit_log WHERE session_id = ? AND habit_type = 'study' AND registered_at >= ?",
    [sessionId, startDate]
  );
  const subjects = prepare<{ subject: string }>(
    "SELECT DISTINCT subject FROM habit_log WHERE session_id = ? AND habit_type = 'study' AND subject IS NOT NULL AND registered_at >= ?",
    [sessionId, startDate]
  );
  const mealTypes: Record<string, number> = {};
  for (const meal of meals) { if (meal.meal_type) mealTypes[meal.meal_type] = meal.count; }
  return {
    total_meals: meals.reduce((sum, m) => sum + m.count, 0),
    total_study_sessions: studyRow?.count ?? 0,
    total_study_minutes: studyRow?.total_minutes ?? 0,
    subjects: subjects.map((s) => s.subject),
    meal_types: mealTypes,
  };
}
