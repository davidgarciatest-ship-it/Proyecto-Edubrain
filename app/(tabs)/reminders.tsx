import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useReminders } from '../../src/hooks/useReminders';
import { requestPermissions, scheduleReminder, cancelAllReminders } from '../../src/services/notificationService';
import { ReminderCard } from '../../src/components/reminders/ReminderCard';
import { CreateReminderModal } from '../../src/components/reminders/CreateReminderModal';
import { colors } from '../../src/constants/colors';
import type { Reminder } from '../../src/types/index';

export default function RemindersScreen() {
  const { reminders, loadReminders, createReminder, toggleReminder, deleteReminder } = useReminders();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => { requestPermissions(); loadReminders() }, [loadReminders]);

  async function handleCreate(data: { title: string; type: string; time: string; days: number[] }) {
    const r = await createReminder({ title: data.title, reminderType: data.type as any, scheduledTime: data.time, repeatDays: data.days.length > 0 ? data.days : undefined });
    if (r) await scheduleReminder(r.id, r.title, r.scheduled_time, data.days.length > 0 ? data.days : null);
  }

  async function handleToggle(item: Reminder) {
    await toggleReminder(item.id, item.enabled ? 0 : 1);
    await cancelAllReminders();
    for (const r of reminders) {
      if (r.id !== item.id && r.enabled || r.id === item.id && !item.enabled) {
        const days = r.repeat_days ? JSON.parse(r.repeat_days) : null;
        await scheduleReminder(r.id, r.title, r.scheduled_time, days);
      }
    }
  }

  function handleDelete(id: number) {
    Alert.alert('Eliminar recordatorio', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        await deleteReminder(id); await cancelAllReminders();
        for (const r of reminders) {
          if (r.id !== id && r.enabled) {
            const days = r.repeat_days ? JSON.parse(r.repeat_days) : null;
            await scheduleReminder(r.id, r.title, r.scheduled_time, days);
          }
        }
      }},
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>← Volver</Text></TouchableOpacity>
        <Text style={styles.title}>Recordatorios</Text>
        <View style={{ width: 70 }} />
      </View>
      <FlatList style={styles.list} contentContainerStyle={styles.listContent} data={reminders} keyExtractor={(i) => i.id.toString()}
        renderItem={({ item }) => <ReminderCard item={item} onToggle={handleToggle} onDelete={handleDelete} />}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>No hay recordatorios</Text><Text style={styles.emptySub}>Toca + para crear uno</Text></View>} />
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}><Text style={styles.fabText}>+</Text></TouchableOpacity>
      <CreateReminderModal visible={modalVisible} onClose={() => setModalVisible(false)} onCreate={handleCreate} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.outline },
  back: { fontSize: 16, color: colors.primary, fontWeight: '500' },
  title: { fontSize: 18, fontWeight: '700', color: colors.onSurface },
  list: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 80 },
  empty: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 18, color: colors.onSurfaceVariant, fontWeight: '600' },
  emptySub: { fontSize: 14, color: colors.onSurfaceVariant, marginTop: 4 },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
  fabText: { color: colors.onPrimary, fontSize: 28, fontWeight: '600', marginTop: -2 },
});
