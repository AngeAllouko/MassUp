import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';
import {
  Screen, Header, Card, Label, Segmented, GradientBar, PrimaryButton, Field, mono,
} from '../components/ui';
import { colors, radius } from '../theme';

const LEVEL_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

function WeightChart({ data }) {
  const [width, setWidth] = useState(0);
  const H = 150;
  const pts = data.slice(-10);
  if (pts.length < 2) return null;

  const vals = pts.map((p) => p.value);
  const min = Math.min(...vals) - 0.5;
  const max = Math.max(...vals) + 0.5;
  const range = max - min || 1;
  const padX = 12;
  const padY = 16;

  const xy = pts.map((p, i) => ({
    x: padX + (i * (width - padX * 2)) / (pts.length - 1),
    y: padY + (1 - (p.value - min) / range) * (H - padY * 2),
  }));
  const line = xy.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${xy[xy.length - 1].x},${H} L${xy[0].x},${H} Z`;
  const last = xy[xy.length - 1];

  return (
    <View style={{ marginTop: 18 }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 && (
        <Svg width={width} height={H}>
          <Defs>
            <LinearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.teal} stopOpacity="0.30" />
              <Stop offset="1" stopColor={colors.teal} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d={area} fill="url(#wfill)" />
          <Path d={line} stroke={colors.teal} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          {xy.map((p, i) => (
            <Circle key={i} cx={p.x} cy={p.y} r={i === xy.length - 1 ? 0 : 3} fill={colors.teal} />
          ))}
          <Circle cx={last.x} cy={last.y} r={9} fill={colors.teal} opacity={0.25} />
          <Circle cx={last.x} cy={last.y} r={4.5} fill={colors.white} />
        </Svg>
      )}
      <View style={s.chartDates}>
        <Text style={s.chartDate}>{pts[0].date}</Text>
        <Text style={s.chartDate}>{pts[pts.length - 1].date}</Text>
      </View>
    </View>
  );
}

export default function ProgressScreen() {
  const profile = useStore((st) => st.profile);
  const targets = useStore((st) => st.targets);
  const day = useStore((st) => st.day);
  const weightHistory = useStore((st) => st.weightHistory);
  const addWeight = useStore((st) => st.addWeight);

  const [tab, setTab] = useState('weight');
  const [newWeight, setNewWeight] = useState('');

  const start = parseFloat(profile.weight);
  const current = weightHistory.length ? weightHistory[weightHistory.length - 1].value : start;
  const diff = current - start;
  const up = diff >= 0;
  const diffTxt = `${up ? '+' : ''}${diff.toFixed(1)} kg`;

  const handleAdd = () => {
    const v = parseFloat(newWeight.replace(',', '.'));
    if (!v || v < 30 || v > 300) {
      Alert.alert('Invalid weight', 'Enter a valid weight in kg.');
      return;
    }
    addWeight(v);
    setNewWeight('');
  };

  const rows = [
    { label: 'Calories', val: day.calories, goal: targets.calories, unit: 'kcal', color: colors.teal },
    { label: 'Protein', val: Math.round(day.protein), goal: targets.protein, unit: 'g', color: colors.protein },
    { label: 'Carbs', val: Math.round(day.carbs), goal: targets.carbs, unit: 'g', color: colors.carbs },
    { label: 'Fat', val: Math.round(day.fat), goal: targets.fat, unit: 'g', color: colors.fat },
    { label: 'Hydration', val: day.water, goal: targets.water, unit: 'ml', color: colors.water },
  ];

  const stats = [
    { label: 'Daily calories', val: targets.calories, unit: 'kcal', icon: 'flame-outline', color: colors.teal },
    { label: 'Daily protein', val: targets.protein, unit: 'g', icon: 'barbell-outline', color: colors.protein },
    { label: 'Daily water', val: targets.water, unit: 'ml', icon: 'water-outline', color: colors.water },
    { label: 'Level', val: LEVEL_LABELS[profile.level] || profile.level, unit: '', icon: 'trophy-outline', color: colors.carbs },
  ];

  return (
    <Screen>
      <Header title="Progress" subtitle="Track your weight and your daily targets." />

      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { id: 'weight', label: 'Weight' },
          { id: 'today', label: 'Today' },
          { id: 'profile', label: 'Profile' },
        ]}
      />

      {tab === 'weight' && (
        <>
          <Card hero>
            <Label color={colors.teal}>Weight change</Label>
            <View style={s.weightRow}>
              <View>
                <Text style={[s.weightBig, mono]}>{current}</Text>
                <Text style={s.weightSub}>kg now · started at {start}</Text>
              </View>
              <View style={[s.delta, { backgroundColor: up ? colors.tealSoft : 'rgba(255,107,107,0.12)' }]}>
                <Ionicons
                  name={up ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={up ? colors.teal : colors.danger}
                />
                <Text style={[s.deltaTxt, { color: up ? colors.teal : colors.danger }]}>{diffTxt}</Text>
              </View>
            </View>
            <WeightChart data={weightHistory} />
            {weightHistory.length < 2 && (
              <View style={s.chartEmpty}>
                <Ionicons name="analytics-outline" size={26} color={colors.textFaint} />
                <Text style={s.chartEmptyTxt}>Log at least 2 weigh-ins to see your chart.</Text>
              </View>
            )}
          </Card>

          <Card>
            <Label style={{ marginBottom: 14 }}>New weigh-in</Label>
            <Field
              placeholder="Your weight today"
              suffix="kg"
              value={newWeight}
              onChangeText={setNewWeight}
              keyboardType="decimal-pad"
              style={{ marginBottom: 12 }}
            />
            <PrimaryButton label="Save weigh-in" icon="checkmark" onPress={handleAdd} />
          </Card>

          {weightHistory.length > 0 && (
            <Card style={{ paddingVertical: 8 }}>
              <Label style={{ marginTop: 12, marginBottom: 4 }}>History</Label>
              {[...weightHistory].reverse().slice(0, 10).map((p, i, arr) => (
                <View key={i} style={[s.histRow, i < arr.length - 1 && s.histDivider]}>
                  <Text style={s.histDate}>{p.date}</Text>
                  <Text style={[s.histVal, mono]}>{p.value} kg</Text>
                </View>
              ))}
            </Card>
          )}
        </>
      )}

      {tab === 'today' && (
        <Card hero>
          <Label color={colors.teal} style={{ marginBottom: 18 }}>Today's report</Label>
          {rows.map((r) => {
            const p = Math.min(Math.round((r.val / (r.goal || 1)) * 100), 100);
            return (
              <View key={r.label} style={{ marginBottom: 18 }}>
                <View style={s.rowHead}>
                  <Text style={s.rowLabel}>{r.label}</Text>
                  <Text style={[s.rowVal, mono]}>
                    {r.val}
                    <Text style={s.rowGoal}> / {r.goal} {r.unit}</Text>
                  </Text>
                </View>
                <GradientBar pct={p} height={7} from={r.color} to={r.color} />
                <Text style={[s.rowPct, p >= 100 && { color: colors.teal }]}>{p}%</Text>
              </View>
            );
          })}
        </Card>
      )}

      {tab === 'profile' && (
        <>
          <View style={s.statsGrid}>
            {stats.map((st) => (
              <View key={st.label} style={s.stat}>
                <View style={[s.statIcon, { backgroundColor: `${st.color}1F` }]}>
                  <Ionicons name={st.icon} size={18} color={st.color} />
                </View>
                <Text style={[s.statVal, mono]}>{st.val}</Text>
                {st.unit ? <Text style={s.statUnit}>{st.unit}</Text> : null}
                <Text style={s.statLabel}>{st.label}</Text>
              </View>
            ))}
          </View>

          <Card style={{ paddingVertical: 8 }}>
            {[
              { label: 'Name', val: profile.name },
              { label: 'Starting weight', val: `${profile.weight} kg` },
              { label: 'Height', val: `${profile.height} cm` },
              { label: 'Age', val: `${profile.age} years` },
              { label: 'Level', val: LEVEL_LABELS[profile.level] || profile.level },
            ].map((r, i, arr) => (
              <View key={r.label} style={[s.histRow, i < arr.length - 1 && s.histDivider]}>
                <Text style={s.histDate}>{r.label}</Text>
                <Text style={s.profVal}>{r.val}</Text>
              </View>
            ))}
          </Card>
        </>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  weightRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12 },
  weightBig: { color: colors.text, fontSize: 52, fontWeight: '300', letterSpacing: -2 },
  weightSub: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill },
  deltaTxt: { fontSize: 14, fontWeight: '800' },
  chartDates: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  chartDate: { color: colors.textMuted, fontSize: 11 },
  chartEmpty: { alignItems: 'center', gap: 8, paddingVertical: 24 },
  chartEmptyTxt: { color: colors.textMuted, fontSize: 13, textAlign: 'center' },

  histRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  histDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  histDate: { color: colors.textMuted, fontSize: 14 },
  histVal: { color: colors.text, fontSize: 15 },
  profVal: { color: colors.text, fontSize: 14, fontWeight: '700' },

  rowHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  rowLabel: { color: colors.textDim, fontSize: 14, fontWeight: '700' },
  rowVal: { color: colors.text, fontSize: 15 },
  rowGoal: { color: colors.textMuted, fontSize: 12 },
  rowPct: { color: colors.textMuted, fontSize: 11, marginTop: 5, fontWeight: '700' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 14 },
  stat: {
    width: '47.5%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, padding: 18,
  },
  statIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  statVal: { color: colors.text, fontSize: 24 },
  statUnit: { color: colors.textMuted, fontSize: 11 },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 6 },
});
