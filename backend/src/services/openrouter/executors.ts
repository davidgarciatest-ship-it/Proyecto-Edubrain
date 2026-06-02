import OpenAI from 'openai';
import { saveHabit, getHabitsSummary, upsertProfile, createReminder } from '../../database/queries';

type ToolMsg = OpenAI.Chat.Completions.ChatCompletionToolMessageParam;

export function executeTool(toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall, sessionId: string): ToolMsg {
  const args = JSON.parse(toolCall.function.arguments);
  switch (toolCall.function.name) {
    case 'register_habit': {
      const habit = saveHabit(sessionId, args.habit_type, args.description, {
        subject: args.subject, durationMinutes: args.duration_minutes, mealType: args.meal_type, foods: args.foods,
      });
      return { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify({
        success: true, id: habit.id, message: `${args.habit_type === 'meal' ? 'Comida' : 'Sesión de estudio'} registrada correctamente.`,
      }) };
    }
    case 'get_habit_analysis': {
      const summary = getHabitsSummary(sessionId, args.period);
      return { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(summary) };
    }
    case 'register_profile': {
      const profile = upsertProfile(sessionId, {
        academicLevel: args.academic_level, school: args.school, subjects: args.subjects, goals: args.goals,
      });
      return { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify({
        success: true, message: 'Perfil académico actualizado correctamente.', profile,
      }) };
    }
    case 'set_reminder': {
      const reminder = createReminder(sessionId, {
        title: args.title, reminderType: args.reminder_type, scheduledTime: args.scheduled_time, repeatDays: args.repeat_days,
      });
      return { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify({
        success: true, id: reminder.id, message: `Recordatorio "${reminder.title}" creado para las ${reminder.scheduled_time}.`,
      }) };
    }
    default:
      return { role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify({ success: false, message: 'Tool desconocido' }) };
  }
}
