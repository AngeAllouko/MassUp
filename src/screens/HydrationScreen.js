import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';
import { Screen, Header, Card, Label, Ring, mono } from '../components/ui';
import { colors, radius } from '../theme';

const AMOUNTS = [150, 250, 330, 500];
const TIPS = [
  { icon: 'sunny-outline', title: 'When you wake up', text: 'Drink 500 ml right away to kick-start your metabolism.' },
  { icon: 'barbell-outline', title: 'Before training', text: 'Hydrate 30 minutes before your session.' },
  { icon: 'timer-outline', title: 'During training', text: 'Sip 150 to 250 ml every 20 minutes.' },
  { icon: 'moon-outline', title: 'After training', text: 'Replace sweat losses with at least 500 ml.' },
];

export default function HydrationScreen() {
  const targets = useStore((s) => s.targets);
  const day = useStore((s) => s.day);
  const addWater = useStore((s) => s.addWater);

  const pct = Math.min(day.water / (targets.water || 1), 1);
  const remaining = Math.max(targets.water - day.water, 0);
  const glassesTotal = Math.max(1, Math.round(targets.water / 250));
  const glassesDrunk = Math.floor(day.water / 250);

  return (
    <Screen>
      <Header title="Hydration" subtitle="Your goal is based on your body weight." />

      <Card hero style={{ alignItems: 'center', paddingVertical: 30 }}>
        <Ring size={220} stroke={14} progress={pct} from="#1B8FB0" to={colors.water}>
          <Text style={[s.big, mono]}>{(day.water / 1000).toFixed(1)}</Text>
          <Text style={s.bigUnit}>litres</Text>
        </Ring>
        <Text style={s.goal}>
          Goal: {(targets.water / 1000).toFixed(1)} L · {Math.round(pct * 100)}%
        </Text>
        <Text style={s.remaining}>
          {remaining > 0 ? `${remaining} ml to go` : 'Goal reached. Great job!'}
        </Text>

        <View style={s.glasses}>
          {Array.from({ length: glassesTotal }).map((_, i) => (
            <View key={i} style={[s.glass, i < glassesDrunk && s.glassFull]} />
          ))}
        </View>
        <Text style={s.glassNote}>1 bar = 250 ml</Text>
      </Card>

      <Label style={{ marginBottom: 12, marginLeft: 4 }}>Add water</Label>
      <View style={s.amounts}>
        {AMOUNTS.map((q) => (
          <Pressable
            key={q}
            onPress={() => addWater(q)}
            style={({ pressed }) => [s.amountBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] }]}
          >
            <Ionicons name="water" size={18} color={colors.water} />
            <Text style={[s.amountVal, mono]}>{q}</Text>
            <Text style={s.amountUnit}>ml</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => addWater(-250)}
        disabled={day.water === 0}
        style={[s.undo, day.water === 0 && { opacity: 0.35 }]}
      >
        <Ionicons name="arrow-undo-outline" size={16} color={colors.textMuted} />
        <Text style={s.undoTxt}>Undo 250 ml</Text>
      </Pressable>

      <Label style={{ marginBottom: 12, marginLeft: 4, marginTop: 10 }}>Tips</Label>
      <Card style={{ paddingVertical: 8 }}>
        {TIPS.map((t, i) => (
          <View key={t.title} style={[s.tip, i < TIPS.length - 1 && s.tipDivider]}>
            <View style={s.tipIcon}>
              <Ionicons name={t.icon} size={18} color={colors.water} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.tipTitle}>{t.title}</Text>
              <Text style={s.tipText}>{t.text}</Text>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  big: { color: colors.text, fontSize: 52, fontWeight: '300', letterSpacing: -2 },
  bigUnit: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  goal: { color: colors.textDim, fontSize: 14, fontWeight: '700', marginTop: 20 },
  remaining: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  glasses: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginTop: 20 },
  glass: { width: 14, height: 40, borderRadius: 7, backgroundColor: 'rgba(255,255,255,0.07)' },
  glassFull: { backgroundColor: colors.water },
  glassNote: { color: colors.textFaint, fontSize: 11, marginTop: 10 },

  amounts: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  amountBtn: {
    flex: 1, alignItems: 'center', gap: 4, paddingVertical: 16,
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: 'rgba(76,201,240,0.22)',
  },
  amountVal: { color: colors.text, fontSize: 18 },
  amountUnit: { color: colors.textMuted, fontSize: 11 },
  undo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  undoTxt: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },

  tip: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  tipDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  tipIcon: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(76,201,240,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  tipTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  tipText: { color: colors.textMuted, fontSize: 13, marginTop: 2, lineHeight: 18 },
});
