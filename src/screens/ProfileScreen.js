import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import useStore, { calculateTargets } from '../store/useStore';
import { Screen, Card, Label, Field, Segmented, PrimaryButton, mono } from '../components/ui';
import { colors } from '../theme';

export const LEVEL_OPTIONS = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export default function ProfileScreen() {
  const setProfile = useStore((s) => s.setProfile);

  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState('beginner');

  const w = parseFloat(weight);
  const h = parseFloat(height);
  const a = parseFloat(age);
  const ready = w > 0 && h > 0 && a > 0;
  const preview = ready ? calculateTargets({ weight, height, age, level }) : null;

  const submit = () => {
    if (!name.trim() || !weight || !height || !age) {
      Alert.alert('Missing fields', 'Please fill in every field to continue.');
      return;
    }
    if (w < 30 || w > 300 || h < 100 || h > 250 || a < 10 || a > 100) {
      Alert.alert('Check your details', 'Some values look off. Please double-check them.');
      return;
    }
    setProfile({ name: name.trim(), weight, height, age, level });
  };

  return (
    <Screen tabPad={false}>
      <Text style={s.brand}>MassUp</Text>
      <Text style={s.title}>Let's build{'\n'}your plan</Text>
      <Text style={s.sub}>Your calorie, protein and water targets are calculated for you.</Text>

      <Card>
        <Field label="First name" placeholder="e.g. Kofi" value={name} onChangeText={setName} />
        <View style={s.row}>
          <Field style={{ flex: 1 }} label="Weight" suffix="kg" placeholder="72" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
          <Field style={{ flex: 1 }} label="Height" suffix="cm" placeholder="178" value={height} onChangeText={setHeight} keyboardType="numeric" />
        </View>
        <Field label="Age" suffix="years" placeholder="24" value={age} onChangeText={setAge} keyboardType="numeric" />

        <Text style={s.fieldLabel}>Training level</Text>
        <Segmented options={LEVEL_OPTIONS} value={level} onChange={setLevel} style={{ marginBottom: 0 }} />
      </Card>

      {preview && (
        <Card hero>
          <Label color={colors.teal} style={{ marginBottom: 14 }}>Your daily targets</Label>
          {[
            { l: 'Calories', v: `${preview.calories} kcal` },
            { l: 'Protein', v: `${preview.protein} g` },
            { l: 'Water', v: `${preview.water} ml` },
          ].map((r) => (
            <View key={r.l} style={s.prevRow}>
              <Text style={s.prevLabel}>{r.l}</Text>
              <Text style={[s.prevVal, mono]}>{r.v}</Text>
            </View>
          ))}
        </Card>
      )}

      <PrimaryButton label="Get started" icon="arrow-forward" onPress={submit} />
    </Screen>
  );
}

const s = StyleSheet.create({
  brand: { color: colors.teal, fontSize: 13, fontWeight: '800', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 },
  title: { color: colors.text, fontSize: 46, fontWeight: '900', letterSpacing: -2, lineHeight: 48 },
  sub: { color: colors.textMuted, fontSize: 14, lineHeight: 20, marginTop: 12, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 12 },
  fieldLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600', marginBottom: 7 },
  prevRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  prevLabel: { color: colors.textMuted, fontSize: 14 },
  prevVal: { color: colors.text, fontSize: 15 },
});
