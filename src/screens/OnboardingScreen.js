import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Glow, PrimaryButton } from '../components/ui';
import { colors } from '../theme';

const SLIDES = [
  {
    icon: 'barbell-outline',
    color: colors.teal,
    title: 'Welcome to\nMassUp',
    text: 'Your bulking companion. Simple, focused and built around the food you actually eat.',
  },
  {
    icon: 'restaurant-outline',
    color: colors.carbs,
    title: 'Eat local,\ntrack easily',
    text: 'Log meals from a food list that includes attiéké, garba, foutou, chicken fried rice and more.',
  },
  {
    icon: 'water-outline',
    color: colors.water,
    title: 'Smart\nhydration',
    text: 'Your water goal is based on your weight, with optional reminders through the day.',
  },
  {
    icon: 'timer-outline',
    color: colors.teal,
    title: 'Rest timer for\nevery set',
    text: 'Train your own way. Pick a rest from 1:30 to 3:00 and we will tell you when it is over.',
  },
  {
    icon: 'stats-chart-outline',
    color: colors.fat,
    title: 'See your\nprogress',
    text: 'Weight chart, daily report and targets. Watch your progress build week after week.',
  },
];

export default function OnboardingScreen({ onDone }) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const last = index === SLIDES.length - 1;

  const go = (i) => {
    ref.current?.scrollTo({ x: i * width, animated: true });
    setIndex(i);
  };

  const finish = async () => {
    try {
      await AsyncStorage.setItem('massup_onboarding', 'done');
    } catch (e) {
      console.error(e);
    }
    onDone();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Glow size={460} color={SLIDES[index].color} opacity={0.22} style={{ top: -120, alignSelf: 'center' }} />

      <View style={[s.top, { paddingTop: insets.top + 12 }]}>
        {!last && (
          <Pressable onPress={finish} hitSlop={10}>
            <Text style={s.skip}>Skip</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        {SLIDES.map((sl) => (
          <View key={sl.title} style={{ width, paddingHorizontal: 28, justifyContent: 'center' }}>
            <View style={s.art}>
              <View style={[s.ring, { width: 250, height: 250, borderRadius: 125, borderColor: `${sl.color}22` }]} />
              <View style={[s.ring, { width: 190, height: 190, borderRadius: 95, borderColor: `${sl.color}38` }]} />
              <View style={[s.core, { backgroundColor: `${sl.color}1A`, borderColor: `${sl.color}55` }]}>
                <Ionicons name={sl.icon} size={54} color={sl.color} />
              </View>
            </View>
            <Text style={s.title}>{sl.title}</Text>
            <Text style={s.text}>{sl.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[s.footer, { paddingBottom: insets.bottom + 20 }]}>
        <View style={s.dots}>
          {SLIDES.map((_, i) => (
            <Pressable key={i} onPress={() => go(i)} hitSlop={6}>
              <View style={[s.dot, i === index && { width: 26, backgroundColor: SLIDES[index].color }]} />
            </Pressable>
          ))}
        </View>
        <PrimaryButton
          label={last ? 'Get started' : 'Next'}
          icon="arrow-forward"
          onPress={last ? finish : () => go(index + 1)}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  top: { height: 70, paddingHorizontal: 24, alignItems: 'flex-end', justifyContent: 'center' },
  skip: { color: colors.textMuted, fontSize: 14, fontWeight: '700' },
  art: { height: 270, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  ring: { position: 'absolute', borderWidth: 1 },
  core: { width: 128, height: 128, borderRadius: 64, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 42, fontWeight: '900', letterSpacing: -1.8, lineHeight: 44, marginBottom: 14 },
  text: { color: colors.textMuted, fontSize: 16, lineHeight: 24 },
  footer: { paddingHorizontal: 24, gap: 22 },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)' },
});
