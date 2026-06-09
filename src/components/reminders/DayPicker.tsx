import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface Props { selected: number[]; onToggle: (day: number) => void }

export function DayPicker({ selected, onToggle }: Props) {
  return (
    <View style={styles.row}>
      {DAYS.map((day, i) => (
        <TouchableOpacity key={i} style={[styles.btn, selected.includes(i) && styles.active]} onPress={() => onToggle(i)}>
          <Text style={[styles.text, selected.includes(i) && styles.activeText]}>{day}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  btn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.outline, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: 11, color: colors.onSurface },
  activeText: { color: colors.onPrimary, fontWeight: '600' },
});
