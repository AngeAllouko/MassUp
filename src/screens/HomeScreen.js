import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';
import { Screen, Card, Label, Ring, GradientBar, PrimaryButton, IconButton, GradientFill, mono } from '../components/ui';
import { colors, radius } from '../theme';

const pctOf = (v, t) => Math.min(Math.round((v / (t || 1)) * 100), 100);

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function headline(pct) {
  if (pct >= 100) return 'Target\nreached';
  if (pct >= 70) return 'Almost\nthere';
  if (pct >= 30) return 'Keep\nfueling';
  return 'Time to\nfuel up';
}

const CAPSULES = 8;

export default function HomeScreen({ navigation }) {
  const profile = useStore((s) => s.profile);
  const targets = useStore((s) => s.targets);
  const day = useStore((s) => s.day);
  const addWater = useStore((s) => s.addWater);

  const calPct = pctOf(day.calories, targets.calories);
  const waterPct = pctOf(day.water, targets.water);
  const waterL = (day.water / 1000).toFixed(1);
  const goalL = (targets.water / 1000).toFixed(1);

  const macros = [
    { label: 'Protein', val: day.protein, goal: targets.protein, color: colors.protein },
    { label: 'Carbs', val: day.carbs, goal: targets.carbs, color: colors.carbs },
    { label: 'Fat', val: day.fat, goal: targets.fat, color: colors.fat },
  ];

  return (
    <Screen>
      {/* Top bar */}
      <View style={s.top}>
        <View style={s.avatar}>
          <Text style={s.avatarTxt}>{(profile.name || 'M').charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.hello}>{greeting()}</Text>
          <Text style={s.name} numberOfLines={1}>{profile.name}</Text>
        </View>
        <IconButton name="settings-outline" onPress={() => navigation.navigate('Settings')} />
      </View>

      {/* Hero */}
      <Card hero style={{ marginBottom: 14 }}>
        <Label color={colors.teal}>Today's fuel</Label>
        <View style={s.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={s.heroTitle}>{headline(calPct)}</Text>
          </View>
          <Ring size={128} stroke={9} progress={calPct / 100}>
            <Text style={[s.ringVal, mono]}>{calPct}%</Text>
            <Text style={s.ringSub}>of goal</Text>
          </Ring>
        </View>
        <PrimaryButton
          label="Log a meal"
          icon="add"
          onPress={() => navigation.navigate('Nutrition')}
          style={{ alignSelf: 'flex-start', paddingVertical: 12 }}
        />
      </Card>

      {/* Calories */}
      <Card>
        <Label>Calories</Label>
        <View style={s.calRow}>
          <Text style={[s.bigNum, mono]}>{day.calories.toLocaleString('en-US')}</Text>
          <Text style={s.calGoal}> / {targets.calories.toLocaleString('en-US')} kcal</Text>
        </View>
        <GradientBar pct={calPct} height={8} />
      </Card>

      {/* Macros */}
      <View style={s.macroRow}>
        {macros.map((m) => (
          <View key={m.label} style={s.macroCard}>
            <Text style={s.macroLabel}>{m.label}</Text>
            <Text style={[s.macroVal, mono, { color: m.color }]}>
              {Math.round(m.val)}
              <Text style={s.macroUnit}>g</Text>
            </Text>
            <GradientBar
              pct={pctOf(m.val, m.goal)}
              height={4}
              from={m.color}
              to={m.color}
              style={{ marginVertical: 8 }}
            />
            <Text style={s.macroGoal}>of {m.goal}g</Text>
          </View>
        ))}
      </View>

      {/* Hydration */}
      <Card>
        <View style={s.hydroTop}>
          <View style={{ flex: 1 }}>
            <Label color={colors.water}>Hydration</Label>
            <View style={s.calRow}>
              <Text style={[s.bigNum, mono]}>{waterL}</Text>
              <Text style={s.calGoal}> L of {goalL} L</Text>
            </View>
          </View>
          <Pressable
            onPress={() => addWater(250)}
            style={({ pressed }) => [s.waterBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="add" size={16} color={colors.water} />
            <Text style={s.waterBtnTxt}>250 ml</Text>
          </Pressable>
        </View>
        <View style={s.capsules}>
          {Array.from({ length: CAPSULES }).map((_, i) => {
            const fill = Math.max(0, Math.min(waterPct / 100 * CAPSULES - i, 1));
            return (
              <View key={i} style={s.capsule}>
                <View style={[s.capsuleFill, { height: `${fill * 100}%` }]} />
              </View>
            );
          })}
        </View>
      </Card>

      {/* Rest timer */}
      <Card onPress={() => navigation.navigate('Training')} style={{ padding: 0 }}>
        <GradientFill stops={[[0, '#0D3A41', 0.9], [1, '#071012', 1]]} />
        <View style={s.restRow}>
          <View style={s.restIcon}>
            <Ionicons name="timer-outline" size={24} color={colors.teal} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.restTitle}>Rest timer</Text>
            <Text style={s.restSub}>Train your way. Pick 1:30 to 3:00.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </View>
      </Card>
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: colors.tealSoft, borderWidth: 1, borderColor: colors.borderTeal,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTxt: { color: colors.teal, fontSize: 18, fontWeight: '900' },
  hello: { color: colors.textMuted, fontSize: 13 },
  name: { color: colors.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },

  heroRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
  heroTitle: { color: colors.text, fontSize: 44, fontWeight: '900', letterSpacing: -2, lineHeight: 46 },
  ringVal: { color: colors.text, fontSize: 26, fontWeight: '700' },
  ringSub: { color: colors.textMuted, fontSize: 11, marginTop: 2 },

  calRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 10, marginBottom: 14 },
  bigNum: { color: colors.text, fontSize: 38, fontWeight: '300', letterSpacing: -1 },
  calGoal: { color: colors.textMuted, fontSize: 14 },

  macroRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  macroCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14,
    borderWidth: 1, borderColor: colors.border,
  },
  macroLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  macroVal: { fontSize: 24, fontWeight: '400', marginTop: 8 },
  macroUnit: { fontSize: 12, color: colors.textMuted },
  macroGoal: { color: colors.textMuted, fontSize: 11 },

  hydroTop: { flexDirection: 'row', alignItems: 'flex-start' },
  waterBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(76,201,240,0.12)', borderWidth: 1, borderColor: 'rgba(76,201,240,0.3)',
    borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 10,
  },
  waterBtnTxt: { color: colors.water, fontSize: 13, fontWeight: '800' },
  capsules: { flexDirection: 'row', gap: 6, height: 54 },
  capsule: {
    flex: 1, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden', justifyContent: 'flex-end',
  },
  capsuleFill: { width: '100%', backgroundColor: colors.water, borderRadius: 10 },

  restRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18 },
  restIcon: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: colors.tealSoft,
    borderWidth: 1, borderColor: colors.borderTeal, alignItems: 'center', justifyContent: 'center',
  },
  restTitle: { color: colors.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.4 },
  restSub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
});
