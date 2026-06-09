import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useProfile } from '../../src/hooks/useProfile';
import { LevelSelector } from '../../src/components/profile/LevelSelector';
import { TagInput } from '../../src/components/profile/TagInput';
import { colors } from '../../src/constants/colors';
import type { AcademicLevel } from '../../src/types/index';

export default function ProfileScreen() {
  const { profile, isLoading, error, loadProfile, saveProfile } = useProfile();
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>('secundaria');
  const [school, setSchool] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadProfile() }, [loadProfile]);
  useEffect(() => { if (profile) { setAcademicLevel(profile.academicLevel); setSchool(profile.school); setSubjects(profile.subjects); setGoals(profile.goals) } }, [profile]);

  async function handleSave() {
    setSaving(true);
    const ok = await saveProfile({ academicLevel, school, subjects, goals });
    setSaving(false);
    if (ok) Alert.alert('Perfil guardado', 'Tu perfil académico se ha actualizado.');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Perfil Académico</Text>
        <Text style={styles.subtitle}>Esta información ayuda a EduBrain a darte consejos personalizados.</Text>

        <View style={styles.card}><Text style={styles.label}>Nivel educativo</Text><LevelSelector value={academicLevel} onChange={setAcademicLevel} /></View>

        <View style={styles.card}><Text style={styles.label}>Colegio / Universidad</Text>
          <TextInput style={styles.input} value={school} onChangeText={setSchool} placeholder="Nombre de tu institución" placeholderTextColor={colors.onSurfaceVariant} /></View>

        <View style={styles.card}><Text style={styles.label}>Materias</Text>
          <TagInput items={subjects} placeholder="Agregar materia" onAdd={(v) => setSubjects(p => [...p, v])} onRemove={(i) => setSubjects(p => p.filter((_, j) => j !== i))} /></View>

        <View style={styles.card}><Text style={styles.label}>Objetivos</Text>
          <TagInput items={goals} placeholder="Agregar objetivo" onAdd={(v) => setGoals(p => [...p, v])} onRemove={(i) => setGoals(p => p.filter((_, j) => j !== i))} /></View>

        {error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
        <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving || isLoading}>
          {saving ? <ActivityIndicator color={colors.onPrimary} /> : <Text style={styles.saveText}>Guardar perfil</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => router.push('/(tabs)/reminders')}><Text style={styles.linkText}>Gestionar recordatorios →</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: colors.onSurface, marginBottom: 4 },
  subtitle: { fontSize: 14, lineHeight: 20, color: colors.onSurfaceVariant, marginBottom: 20 },
  card: { backgroundColor: colors.surfaceContainer, borderRadius: 12, padding: 16, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: colors.onSurface, marginBottom: 8 },
  input: { backgroundColor: colors.surfaceContainer, borderRadius: 8, borderWidth: 1, borderColor: colors.outline, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: colors.onSurface },
  errorBox: { backgroundColor: colors.errorContainer, borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { color: colors.error, fontSize: 14 },
  saveBtn: { backgroundColor: colors.primary, borderRadius: 9999, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  saveText: { color: colors.onPrimary, fontSize: 16, fontWeight: '600' },
  link: { alignItems: 'center', paddingVertical: 8 },
  linkText: { fontSize: 15, color: colors.primary, fontWeight: '500' },
});
