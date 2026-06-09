import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import type { AcademicLevel } from '../../types/index';

const LEVELS: { label: string; value: AcademicLevel }[] = [
  { label: 'Primaria', value: 'primaria' },
  { label: 'Secundaria', value: 'secundaria' },
  { label: 'Universidad', value: 'universidad' },
];

interface Props { value: AcademicLevel; onChange: (v: AcademicLevel) => void }

export function LevelSelector({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {LEVELS.map(l => (
        <TouchableOpacity key={l.value} style={[styles.btn, value === l.value && styles.active]} onPress={() => onChange(l.value)}>
          <Text style={[styles.text, value === l.value && styles.activeText]}>{l.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 9999, borderWidth: 1, borderColor: colors.outline, alignItems: 'center' },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: 14, color: colors.onSurface },
  activeText: { color: colors.onPrimary, fontWeight: '600' },
});
