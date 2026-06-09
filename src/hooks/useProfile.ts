import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../constants/api';
import type { AcademicLevel } from '../types/index';

const SESSION_KEY = 'edubrain_session_id';

interface ProfileData {
  academicLevel: AcademicLevel;
  school: string;
  subjects: string[];
  goals: string[];
}

async function getSessionId(): Promise<string | undefined> {
  try {
    return (await AsyncStorage.getItem(SESSION_KEY)) ?? undefined;
  } catch {
    return undefined;
  }
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    const sid = await getSessionId();
    if (!sid) return;

    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/profile?sessionId=${sid}`);
      if (!res.ok) throw new Error('Error al cargar perfil');
      const data = await res.json();
      if (data.profile) {
        setProfile({
          academicLevel: data.profile.academic_level,
          school: data.profile.school ?? '',
          subjects: data.profile.subjects ?? [],
          goals: data.profile.goals ?? [],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar perfil');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (data: ProfileData) => {
    const sid = await getSessionId();
    if (!sid) {
      setError('No hay sesión activa. Envía un mensaje en el chat primero.');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: sid, ...data }),
      });
      if (!res.ok) throw new Error('Error al guardar perfil');
      await res.json();
      setProfile(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar perfil');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { profile, isLoading, error, loadProfile, saveProfile };
}
