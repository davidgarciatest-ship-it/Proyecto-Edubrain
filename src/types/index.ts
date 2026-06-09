export interface ChatMessage {
  id: number;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export type HabitType = 'meal' | 'study';

export interface HabitLog {
  id: number;
  session_id: string;
  habit_type: HabitType;
  description: string;
  subject: string | null;
  duration_minutes: number | null;
  meal_type: string | null;
  foods: string | null;
  registered_at: string;
  created_at: string;
}

export type Period = 'day' | 'week' | 'month';

export interface HabitsSummary {
  total_meals: number;
  total_study_sessions: number;
  total_study_minutes: number;
  subjects: string[];
  meal_types: Record<string, number>;
}

export type AcademicLevel = 'primaria' | 'secundaria' | 'universidad';

export interface UserProfile {
  session_id: string;
  academic_level: AcademicLevel;
  school: string | null;
  subjects: string | null;
  goals: string | null;
  created_at: string;
  updated_at: string;
}

export type ReminderType = 'study' | 'meal' | 'goal';

export interface Reminder {
  id: number;
  session_id: string;
  title: string;
  reminder_type: ReminderType;
  scheduled_time: string;
  repeat_days: string | null;
  enabled: number;
  created_at: string;
}
