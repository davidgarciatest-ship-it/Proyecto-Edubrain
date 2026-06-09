import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

interface Props { items: string[]; placeholder: string; onAdd: (v: string) => void; onRemove: (i: number) => void }

export function TagInput({ items, placeholder, onAdd, onRemove }: Props) {
  const [value, setValue] = useState('');
  function handleAdd() { const v = value.trim(); if (v && !items.includes(v)) { onAdd(v); setValue('') } }
  return (
    <View>
      <View style={styles.chipRow}>
        {items.map((s, i) => (
          <TouchableOpacity key={i} style={styles.chip} onPress={() => onRemove(i)}>
            <Text style={styles.chipText}>{s} HOLA</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.addRow}>
        <TextInput style={[styles.input, styles.addInput]} value={value} onChangeText={setValue}
          placeholder={placeholder} placeholderTextColor={colors.onSurfaceVariant} onSubmitEditing={handleAdd} />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}><Text style={styles.addBtnText}>+</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  chip: { backgroundColor: colors.primaryContainer, borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 13, color: colors.primary, fontWeight: '500' },
  addRow: { flexDirection: 'row', gap: 8 },
  addInput: { flex: 1 },
  addBtn: { width: 40, height: 40, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { color: colors.onPrimary, fontSize: 20, fontWeight: '600' },
  input: { backgroundColor: colors.surfaceContainer, borderRadius: 8, borderWidth: 1, borderColor: colors.outline, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: colors.onSurface },
});
