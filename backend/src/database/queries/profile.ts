import { run, getOne } from './_shared';
import type { UserProfile, AcademicLevel } from '../../types/index';

export function upsertProfile(sessionId: string, data: {
  academicLevel: AcademicLevel; school?: string; subjects?: string[]; goals?: string[];
}): UserProfile {
  const existing = getOne<UserProfile>('SELECT * FROM user_profile WHERE session_id = ?', [sessionId]);
  if (existing) {
    run(
      "UPDATE user_profile SET academic_level = ?, school = ?, subjects = ?, goals = ?, updated_at = datetime('now') WHERE session_id = ?",
      [data.academicLevel, data.school ?? existing.school, data.subjects ? JSON.stringify(data.subjects) : existing.subjects, data.goals ? JSON.stringify(data.goals) : existing.goals, sessionId]
    );
  } else {
    run('INSERT INTO user_profile (session_id, academic_level, school, subjects, goals) VALUES (?, ?, ?, ?, ?)',
      [sessionId, data.academicLevel, data.school ?? null, data.subjects ? JSON.stringify(data.subjects) : null, data.goals ? JSON.stringify(data.goals) : null]);
  }
  return getOne<UserProfile>('SELECT * FROM user_profile WHERE session_id = ?', [sessionId])!;
}

export function getProfile(sessionId: string): UserProfile | undefined {
  return getOne<UserProfile>('SELECT * FROM user_profile WHERE session_id = ?', [sessionId]);
}
