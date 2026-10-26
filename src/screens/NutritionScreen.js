import React, { useState, useMemo } from 'react';
import {
  View, Text, Pressable, ScrollView, Modal, TextInput, Alert, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStore from '../store/useStore';
import { FOODS, CATEGORIES, fold } from '../data/foods';
import {
  Screen, Header, Card, Label, Ring, GradientBar, PrimaryButton, IconButton, Chip, Glow, mono,
} from '../components/ui';
import { colors, radius } from '../theme';

const pctOf = (v, t) => Math.min(Math.round((v / (t || 1)) * 100), 100);
const round1 = (n) => Math.round(n * 10) / 10;
const PORTIONS = [50, 100, 150, 200, 250, 300];

/* ------------------------------------------------------------------ */
/* Add-food modal                                                       */
/* ------------------------------------------------------------------ */

function AddFoodModal({ visible, onClose }) {
  const insets = useSafeAreaInsets();
  const addMeal = useStore((s) => s.addMeal);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [grams, setGrams] = useState('100');

  const results = useMemo(() => {
    const q = fold(query.trim());
    return FOODS.filter(
      (f) => (category === 'All' || f.category === category) && fold(f.name).includes(q),
    );
  }, [query, category]);

  const close = () => {
    setSelected(null);
    setQuery('');
    setCategory('All');
    setGrams('100');
    onClose();
  };

  const g = parseFloat(grams) || 0;
  const ratio = g / 100;

  const confirm = () => {
    if (!selected || g <= 0) {
      Alert.alert('Invalid amount', 'Enter a quantity in grams.');
      return;
    }
    addMeal({
      name: selected.name,
      grams: g,
      calories: Math.round(selected.calories * ratio),
      protein: round1(selected.protein * ratio),
      carbs: round1(selected.carbs * ratio),
      fat: round1(selected.fat * ratio),
    });
    close();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <View style={{ flex: 1, backgroundColor: colors.bg, paddingTop: insets.top + 10 }}>
        <Glow size={380} opacity={0.18} style={{ top: -160, right: -140 }} />

        <View style={s.modalHead}>
          {selected ? (
            <IconButton name="chevron-back" onPress={() => setSelected(null)} />
          ) : (
            <View style={{ width: 42 }} />
          )}
          <Text style={s.modalTitle}>{selected ? 'Quantity' : 'Add food'}</Text>
          <IconButton name="close" onPress={close} />
        </View>

        {!selected ? (
          <>
            <View style={s.searchBox}>
              <Ionicons name="search" size={18} color={colors.textMuted} />
              <TextInput
                style={s.searchInput}
                placeholder="Search food (e.g. chicken, attiéké)"
                placeholderTextColor={colors.textFaint}
                selectionColor={colors.teal}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
              />
              {query.length > 0 && (
                <Pressable onPress={() => setQuery('')} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                </Pressable>
              )}
            </View>

            <View style={{ height: 52 }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
              >
                {CATEGORIES.map((c) => (
                  <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
                ))}
              </ScrollView>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 30 }}
            >
              {results.map((f) => (
                <Pressable
                  key={f.name}
                  onPress={() => { setSelected(f); setGrams('100'); }}
                  style={({ pressed }) => [s.foodRow, pressed && { opacity: 0.7 }]}
                >
                  <View style={{ flex: 1 }}>
                    <View style={s.foodNameRow}>
                      <Text style={s.foodName}>{f.name}</Text>
                      {f.isNew ? (
                        <View style={s.newBadge}><Text style={s.newBadgeTxt}>NEW</Text></View>
                      ) : null}
                    </View>
                    <Text style={s.foodSub}>
                      {f.calories} kcal · {f.protein} g protein · per 100 g
                    </Text>
                  </View>
                  <Ionicons name="add-circle" size={26} color={colors.teal} />
                </Pressable>
              ))}
              {results.length === 0 && <Text style={s.empty}>No food found</Text>}
            </ScrollView>
          </>
        ) : (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 30 }}
          >
            <Text style={s.selName}>{selected.name}</Text>
            <Text style={s.selSub}>{selected.calories} kcal per 100 g</Text>

            <View style={s.portions}>
              {PORTIONS.map((p) => (
                <Chip key={p} label={`${p} g`} active={g === p} onPress={() => setGrams(String(p))} />
              ))}
            </View>

            <View style={s.stepper}>
              <Pressable
                style={s.stepBtn}
                onPress={() => setGrams(String(Math.max(10, g - 10)))}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </Pressable>
              <View style={s.gramsBox}>
                <TextInput
                  style={[s.gramsInput, mono]}
                  value={grams}
                  onChangeText={setGrams}
                  keyboardType="numeric"
                  selectionColor={colors.teal}
                />
                <Text style={s.gramsUnit}>g</Text>
              </View>
              <Pressable style={s.stepBtn} onPress={() => setGrams(String(g + 10))}>
                <Ionicons name="add" size={20} color={colors.text} />
              </Pressable>
            </View>

            <Card style={{ marginTop: 22 }}>
              <View style={s.previewRow}>
                {[
                  { l: 'Calories', v: Math.round(selected.calories * ratio), u: 'kcal', c: colors.text },
                  { l: 'Protein', v: round1(selected.protein * ratio), u: 'g', c: colors.protein },
                  { l: 'Carbs', v: round1(selected.carbs * ratio), u: 'g', c: colors.carbs },
                  { l: 'Fat', v: round1(selected.fat * ratio), u: 'g', c: colors.fat },
                ].map((m) => (
                  <View key={m.l} style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={[s.previewVal, mono, { color: m.c }]}>{m.v}</Text>
                    <Text style={s.previewUnit}>{m.u}</Text>
                    <Text style={s.previewLbl}>{m.l}</Text>
                  </View>
                ))}
              </View>
            </Card>

            <PrimaryButton label="Add to today's log" icon="checkmark" onPress={confirm} />
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Screen                                                               */
/* ------------------------------------------------------------------ */

export default function NutritionScreen() {
  const targets = useStore((s) => s.targets);
  const day = useStore((s) => s.day);
  const meals = useStore((s) => s.meals);
  const removeMeal = useStore((s) => s.removeMeal);
  const [adding, setAdding] = useState(false);

  const calPct = pctOf(day.calories, targets.calories);

  const macros = [
    { label: 'Protein', val: day.protein, goal: targets.protein, color: colors.protein },
    { label: 'Carbs', val: day.carbs, goal: targets.carbs, color: colors.carbs },
    { label: 'Fat', val: day.fat, goal: targets.fat, color: colors.fat },
  ];

  const confirmRemove = (m) =>
    Alert.alert('Remove food', `Remove ${m.name} from today's log?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeMeal(m.id) },
    ]);

  return (
    <Screen>
      <Header
        title="Nutrition"
        subtitle={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      />

      <Card hero>
        <View style={s.sumRow}>
          <Ring size={132} stroke={10} progress={calPct / 100}>
            <Text style={[s.ringVal, mono]}>{day.calories}</Text>
            <Text style={s.ringSub}>of {targets.calories} kcal</Text>
          </Ring>
          <View style={{ flex: 1, marginLeft: 20 }}>
            {macros.map((m) => (
              <View key={m.label} style={{ marginBottom: 12 }}>
                <View style={s.macroHead}>
                  <Text style={s.macroName}>{m.label}</Text>
                  <Text style={[s.macroNum, mono]}>
                    {Math.round(m.val)}
                    <Text style={s.macroGoal}> / {m.goal} g</Text>
                  </Text>
                </View>
                <GradientBar pct={pctOf(m.val, m.goal)} height={5} from={m.color} to={m.color} />
              </View>
            ))}
          </View>
        </View>
      </Card>

      <PrimaryButton
        label="Add food"
        icon="add"
        onPress={() => setAdding(true)}
        style={{ marginBottom: 22 }}
      />

      <Label style={{ marginBottom: 12, marginLeft: 4 }}>
        Today's log{meals.length ? ` · ${meals.length} item${meals.length > 1 ? 's' : ''}` : ''}
      </Label>

      {meals.length === 0 ? (
        <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Ionicons name="restaurant-outline" size={30} color={colors.textFaint} />
          <Text style={s.emptyTitle}>Nothing logged yet</Text>
          <Text style={s.emptySub}>Tap "Add food" to log your first meal.</Text>
        </Card>
      ) : (
        <Card style={{ paddingVertical: 6 }}>
          {meals.map((m, i) => (
            <View key={m.id} style={[s.mealRow, i < meals.length - 1 && s.mealDivider]}>
              <View style={{ flex: 1 }}>
                <Text style={s.mealName}>{m.name}</Text>
                <Text style={s.mealSub}>
                  {m.grams} g · {m.protein} g protein · {m.carbs} g carbs
                </Text>
              </View>
              <Text style={[s.mealKcal, mono]}>{m.calories}</Text>
              <Text style={s.mealKcalUnit}>kcal</Text>
              <Pressable onPress={() => confirmRemove(m)} hitSlop={10} style={{ marginLeft: 12 }}>
                <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          ))}
        </Card>
      )}

      <AddFoodModal visible={adding} onClose={() => setAdding(false)} />
    </Screen>
  );
}

const s = StyleSheet.create({
  sumRow: { flexDirection: 'row', alignItems: 'center' },
  ringVal: { color: colors.text, fontSize: 28, fontWeight: '400' },
  ringSub: { color: colors.textMuted, fontSize: 10, marginTop: 2 },
  macroHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  macroName: { color: colors.textDim, fontSize: 12, fontWeight: '700' },
  macroNum: { color: colors.text, fontSize: 13 },
  macroGoal: { color: colors.textMuted, fontSize: 11 },

  emptyTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 12 },
  emptySub: { color: colors.textMuted, fontSize: 13, marginTop: 4 },

  mealRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  mealDivider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  mealName: { color: colors.text, fontSize: 15, fontWeight: '700' },
  mealSub: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  mealKcal: { color: colors.teal, fontSize: 17 },
  mealKcalUnit: { color: colors.textMuted, fontSize: 11, marginLeft: 3 },

  /* modal */
  modalHead: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 14,
  },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, marginBottom: 14,
    backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, borderWidth: 1,
    borderColor: colors.border, paddingHorizontal: 18,
  },
  searchInput: { flex: 1, color: colors.text, fontSize: 15, paddingVertical: 14 },
  foodRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  foodNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  foodName: { color: colors.text, fontSize: 15, fontWeight: '700', flexShrink: 1 },
  foodSub: { color: colors.textMuted, fontSize: 12, marginTop: 3 },
  newBadge: {
    backgroundColor: colors.teal, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2,
  },
  newBadgeTxt: { color: colors.ink, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  empty: { color: colors.textMuted, textAlign: 'center', padding: 30 },

  selName: { color: colors.text, fontSize: 32, fontWeight: '900', letterSpacing: -1.2, marginTop: 6 },
  selSub: { color: colors.textMuted, fontSize: 14, marginTop: 4, marginBottom: 22 },
  portions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  stepBtn: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.surfaceHi,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  gramsBox: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', minWidth: 120 },
  gramsInput: { color: colors.text, fontSize: 44, fontWeight: '300', textAlign: 'center', minWidth: 80 },
  gramsUnit: { color: colors.textMuted, fontSize: 18 },
  previewRow: { flexDirection: 'row' },
  previewVal: { fontSize: 22 },
  previewUnit: { color: colors.textMuted, fontSize: 10 },
  previewLbl: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
});
