import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { DayPicker } from './DayPicker';
import type { ReminderType } from '../../types/index';

const TYPE_LABELS: Record<ReminderType, string> = { study: 'Estudio', meal: 'Comida', goal: 'Meta' };
const TYPE_COLORS: Record<ReminderType, string> = { study: colors.primary, meal: colors.secondary, goal: '#F59E0B' };

interface Props { visible: boolean; onClose: () => void; onCreate: (data: { title: string; type: ReminderType; time: string; days: number[] }) => void }

export function CreateReminderModal({ visible, onClose, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReminderType>('study');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [days, setDays] = useState<number[]>([]);

  function toggleDay(d: number) { setDays(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]) }
  function reset() { setTitle(''); setType('study'); setHour('08'); setMinute('00'); setDays([]) }
  function handleCreate() {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), type, time: `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`, days });
    reset();
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.modalTitle}>Nuevo recordatorio</Text>
          <Text style={styles.label}>Título</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Ej: Estudiar matemáticas" placeholderTextColor={colors.onSurfaceVariant} />
          <Text style={styles.label}>Tipo</Text>
          <View style={styles.typeRow}>
            {(Object.entries(TYPE_LABELS) as [ReminderType, string][]).map(([k, l]) => (
              <TouchableOpacity key={k} style={[styles.typeBtn, type === k && { backgroundColor: TYPE_COLORS[k] + '20', borderColor: TYPE_COLORS[k] }]} onPress={() => setType(k)}>
                <Text style={[styles.typeText, type === k && { color: TYPE_COLORS[k], fontWeight: '600' }]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Hora</Text>
          <View style={styles.timeRow}>
            <TextInput style={[styles.input, styles.timeIn]} value={hour} onChangeText={setHour} keyboardType="number-pad" maxLength={2} />
            <Text style={styles.sep}>:</Text>
            <TextInput style={[styles.input, styles.timeIn]} value={minute} onChangeText={setMinute} keyboardType="number-pad" maxLength={2} />
          </View>
          <Text style={styles.label}>Repetir (opcional)</Text>
          <DayPicker selected={days} onToggle={toggleDay} />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={() => { reset(); onClose() }}><Text style={styles.cancelText}>Cancelar</Text></TouchableOpacity>
            <TouchableOpacity style={styles.create} onPress={handleCreate}><Text style={styles.createText}>Crear</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: colors.onSurface, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: colors.onSurface, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: colors.surfaceContainerLow, borderRadius: 8, borderWidth: 1, borderColor: colors.outline, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: colors.onSurface },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 9999, borderWidth: 1, borderColor: colors.outline, alignItems: 'center' },
  typeText: { fontSize: 14, color: colors.onSurface },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeIn: { width: 60, textAlign: 'center', fontSize: 20 },
  sep: { fontSize: 20, color: colors.onSurface },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancel: { flex: 1, paddingVertical: 14, borderRadius: 9999, borderWidth: 1, borderColor: colors.outline, alignItems: 'center' },
  cancelText: { fontSize: 16, color: colors.onSurface },
  create: { flex: 1, paddingVertical: 14, borderRadius: 9999, backgroundColor: colors.primary, alignItems: 'center' },
  createText: { fontSize: 16, color: colors.onPrimary, fontWeight: '600' },
});
