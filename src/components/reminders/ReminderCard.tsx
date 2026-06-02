import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import type { Reminder, ReminderType } from '../../types/index';

const TYPE_COLORS: Record<ReminderType, string> = { study: colors.primary, meal: colors.secondary, goal: '#F59E0B' };
const TYPE_LABELS: Record<ReminderType, string> = { study: 'Estudio', meal: 'Comida', goal: 'Meta' };

interface Props { item: Reminder; onToggle: (item: Reminder) => void; onDelete: (id: number) => void }

export function ReminderCard({ item, onToggle, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <View style={[styles.badge, { backgroundColor: TYPE_COLORS[item.reminder_type] + '20' }]}>
          <Text style={[styles.badgeText, { color: TYPE_COLORS[item.reminder_type] }]}>
            {TYPE_LABELS[item.reminder_type]}
          </Text>
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.time}>{item.scheduled_time}</Text>
      </View>
      <View style={styles.right}>
        <Switch value={!!item.enabled} onValueChange={() => onToggle(item)}
          trackColor={{ false: colors.outline, true: colors.primary + '60' }} thumbColor={item.enabled ? colors.primary : colors.surfaceDim} />
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Text style={styles.del}>×</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: colors.surfaceContainer, borderRadius: 12, padding: 14, marginBottom: 10, alignItems: 'center' },
  left: { flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { alignSelf: 'flex-start', borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 4 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  title: { fontSize: 16, color: colors.onSurface, fontWeight: '500', marginBottom: 2 },
  time: { fontSize: 14, color: colors.onSurfaceVariant },
  del: { fontSize: 24, color: colors.error, paddingLeft: 8 },
});
