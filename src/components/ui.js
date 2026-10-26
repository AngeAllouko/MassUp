import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
} from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
} from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fonts, TAB_BAR_SPACE } from '../theme';

let uidCounter = 0;
const useUid = () => useState(() => `g${++uidCounter}`)[0];

/* ------------------------------------------------------------------ */
/* Backgrounds                                                          */
/* ------------------------------------------------------------------ */

export function Glow({ size = 320, color = colors.teal, opacity = 0.3, style }) {
  const id = useUid();
  return (
    <Svg
      pointerEvents="none"
      width={size}
      height={size}
      style={[{ position: 'absolute' }, style]}
    >
      <Defs>
        <RadialGradient id={id} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={color} stopOpacity={opacity} />
          <Stop offset="1" stopColor={color} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect width={size} height={size} fill={`url(#${id})`} />
    </Svg>
  );
}

export function GradientFill({ stops, x1 = '0', y1 = '0', x2 = '1', y2 = '1' }) {
  const id = useUid();
  return (
    <Svg style={StyleSheet.absoluteFill} width="100%" height="100%" pointerEvents="none">
      <Defs>
        <LinearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
          {stops.map(([offset, color, opacity = 1]) => (
            <Stop key={`${offset}`} offset={`${offset}`} stopColor={color} stopOpacity={opacity} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}

/* ------------------------------------------------------------------ */
/* Layout                                                               */
/* ------------------------------------------------------------------ */

export function Screen({ children, tabPad = true, contentStyle, scrollRef }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Glow size={420} opacity={0.2} style={{ top: -170, right: -150 }} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          {
            paddingTop: insets.top + 14,
            paddingHorizontal: 20,
            paddingBottom: tabPad ? TAB_BAR_SPACE + insets.bottom : insets.bottom + 32,
          },
          contentStyle,
        ]}
      >
        {children}
      </ScrollView>
    </View>
  );
}

export function Header({ title, subtitle, right }) {
  return (
    <View style={s.header}>
      <View style={{ flex: 1 }}>
        <Text style={s.headerTitle}>{title}</Text>
        {subtitle ? <Text style={s.headerSub}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export function Card({ children, style, hero = false, glow, glowColor, onPress }) {
  const inner = (
    <>
      {hero ? (
        <GradientFill stops={[[0, '#0F4A52'], [0.55, '#0A1A1E'], [1, '#060B0D']]} />
      ) : null}
      {glow || hero ? (
        <Glow
          size={260}
          color={glowColor || colors.teal}
          opacity={hero ? 0.28 : 0.16}
          style={{ top: -90, right: -80 }}
        />
      ) : null}
      {children}
    </>
  );
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [s.card, hero && s.cardHero, style, pressed && { opacity: 0.85 }]}
      >
        {inner}
      </Pressable>
    );
  }
  return <View style={[s.card, hero && s.cardHero, style]}>{inner}</View>;
}

export function Label({ children, style, color }) {
  return <Text style={[s.label, color && { color }, style]}>{children}</Text>;
}

/* ------------------------------------------------------------------ */
/* Progress                                                             */
/* ------------------------------------------------------------------ */

export function Ring({
  size = 160,
  stroke = 10,
  progress = 0,
  from = colors.tealMid,
  to = colors.teal,
  knob = true,
  children,
}) {
  const id = useUid();
  const p = Math.max(0, Math.min(progress, 1));
  const r = (size - stroke) / 2 - (knob ? 4 : 0);
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  const angle = -Math.PI / 2 + 2 * Math.PI * p;
  const kx = cx + r * Math.cos(angle);
  const ky = cx + r * Math.sin(angle);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={from} />
            <Stop offset="1" stopColor={to} />
          </LinearGradient>
        </Defs>
        <Circle
          cx={cx}
          cy={cx}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        {p > 0 ? (
          <Circle
            cx={cx}
            cy={cx}
            r={r}
            stroke={`url(#${id})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${c * p} ${c}`}
            rotation={-90}
            origin={`${cx}, ${cx}`}
          />
        ) : null}
        {knob && p > 0 ? (
          <>
            <Circle cx={kx} cy={ky} r={stroke * 1.1} fill={to} opacity={0.25} />
            <Circle cx={kx} cy={ky} r={stroke * 0.6} fill={colors.white} />
          </>
        ) : null}
      </Svg>
      {children}
    </View>
  );
}

export function GradientBar({
  pct = 0,
  height = 6,
  from = colors.tealMid,
  to = colors.teal,
  style,
}) {
  const id = useUid();
  const w = Math.max(0, Math.min(pct, 100));
  return (
    <View style={[{ height, borderRadius: height, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' }, style]}>
      {w > 0 ? (
        <View style={{ width: `${w}%`, height, borderRadius: height, overflow: 'hidden' }}>
          <Svg width="100%" height="100%">
            <Defs>
              <LinearGradient id={id} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={from} />
                <Stop offset="1" stopColor={to} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill={`url(#${id})`} />
          </Svg>
        </View>
      ) : null}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Controls                                                             */
/* ------------------------------------------------------------------ */

export function PrimaryButton({ label, icon, onPress, variant = 'light', style, disabled }) {
  const bg = variant === 'light' ? colors.white : variant === 'teal' ? colors.teal : 'transparent';
  const fg = variant === 'ghost' ? colors.text : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        s.btn,
        { backgroundColor: bg },
        variant === 'ghost' && { borderWidth: 1, borderColor: colors.borderTeal },
        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
      <Text style={[s.btnTxt, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ name, onPress, size = 20, color = colors.textDim, style }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [s.iconBtn, pressed && { opacity: 0.7 }, style]}
    >
      <Ionicons name={name} size={size} color={color} />
    </Pressable>
  );
}

export function Segmented({ options, value, onChange, style }) {
  return (
    <View style={[s.segmented, style]}>
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            style={[s.segItem, active && s.segItemActive]}
          >
            <Text style={[s.segTxt, active && s.segTxtActive]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Chip({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipActive]}>
      <Text style={[s.chipTxt, active && s.chipTxtActive]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, suffix, style, inputStyle, ...props }) {
  return (
    <View style={[{ marginBottom: 14 }, style]}>
      {label ? <Text style={s.fieldLabel}>{label}</Text> : null}
      <View style={s.fieldBox}>
        <TextInput
          style={[s.fieldInput, inputStyle]}
          placeholderTextColor={colors.textFaint}
          selectionColor={colors.teal}
          {...props}
        />
        {suffix ? <Text style={s.fieldSuffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                               */
/* ------------------------------------------------------------------ */

const s = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -1.5,
  },
  headerSub: { fontSize: 14, color: colors.textMuted, marginTop: 4, lineHeight: 20 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardHero: { borderColor: 'rgba(45,226,208,0.18)', padding: 22 },

  label: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
  },
  btnTxt: { fontSize: 15, fontWeight: '800', letterSpacing: -0.2 },

  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  segItem: { flex: 1, paddingVertical: 11, borderRadius: radius.pill, alignItems: 'center' },
  segItemActive: { backgroundColor: colors.tealSoft, borderWidth: 1, borderColor: colors.borderTeal },
  segTxt: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  segTxtActive: { color: colors.teal },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.tealSoft, borderColor: colors.borderTeal },
  chipTxt: { color: colors.textMuted, fontSize: 13, fontWeight: '700' },
  chipTxtActive: { color: colors.teal },

  fieldLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600', marginBottom: 7 },
  fieldBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
  },
  fieldInput: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 14 },
  fieldSuffix: { color: colors.textMuted, fontSize: 14, marginLeft: 8, fontFamily: fonts.mono },
});

export const mono = { fontFamily: fonts.mono, fontVariant: ['tabular-nums'] };
