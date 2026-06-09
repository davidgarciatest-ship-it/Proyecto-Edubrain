import type { HabitType, Period, AcademicLevel, ReminderType } from '../../types/index';
import { saveHabit, getHabitsSummary, upsertProfile, createReminder } from '../../database/queries';

export function executeTool(name: string, args: Record<string, unknown>, sessionId: string): Record<string, unknown> {
  switch (name) {
    case 'register_habit': {
      const r = args as { habit_type: string; description: string; subject?: string; duration_minutes?: number; meal_type?: string; foods?: string };
      const habit = saveHabit(sessionId, r.habit_type as HabitType, r.description, {
        subject: r.subject, durationMinutes: r.duration_minutes, mealType: r.meal_type, foods: r.foods,
      });
      return { success: true, id: habit.id, message: `${r.habit_type === 'meal' ? 'Comida' : 'Sesión de estudio'} registrada correctamente.` };
    }
    case 'get_habit_analysis': {
      const r = args as { period: string };
      const summary = getHabitsSummary(sessionId, r.period as Period);
      return summary as unknown as Record<string, unknown>;
    }
    case 'register_profile': {
      const r = args as { academic_level: string; school?: string; subjects?: string[]; goals?: string[] };
      const profile = upsertProfile(sessionId, {
        academicLevel: r.academic_level as AcademicLevel, school: r.school, subjects: r.subjects, goals: r.goals,
      });
      return { success: true, message: 'Perfil académico actualizado correctamente.', profile };
    }
    case 'set_reminder': {
      const r = args as { title: string; reminder_type: string; scheduled_time: string; repeat_days?: number[] };
      const reminder = createReminder(sessionId, {
        title: r.title, reminderType: r.reminder_type as ReminderType, scheduledTime: r.scheduled_time, repeatDays: r.repeat_days,
      });
      return { success: true, id: reminder.id, message: `Recordatorio "${reminder.title}" creado para las ${reminder.scheduled_time}.` };
    }
    default:
      return { success: false, message: 'Tool desconocido' };
  }
}
