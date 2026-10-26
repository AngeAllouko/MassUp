import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header, Card, Label, Ring, PrimaryButton, mono } from '../components/ui';
import { scheduleRestEnd, cancelRestEnd } from '../services/notifications';
import { colors, radius } from '../theme';

// 1:30 to 3:00, in 30-second steps.
const DURATIONS = [90, 120, 150, 180];

const fmt = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

export default function TrainingScreen() {
  const [duration, setDuration] = useState(90);
  const [status, setStatus] = useState('idle'); // idle | running | paused | done
  const [remainingMs, setRemainingMs] = useState(90 * 1000);

  const endAtRef = useRef(0);
  const tickRef = useRef(null);
  const runRef = useRef(0);

  const stopTick = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    tickRef.current = null;
  };

  const begin = useCallback((ms, totalSec) => {
    stopTick();
    const run = ++runRef.current;
    endAtRef.current = Date.now() + ms;
    setRemainingMs(ms);
    setStatus('running');

    scheduleRestEnd(ms / 1000).then(() => {
      // The user paused/reset before the notification was scheduled: drop it.
      if (runRef.current !== run) cancelRestEnd();
    });

    tickRef.current = setInterval(() => {
      const left = Math.max(0, endAtRef.current - Date.now());
      setRemainingMs(left);
      if (left === 0) {
        stopTick();
        setStatus('done');
        Vibration.vibrate([0, 300, 150, 300, 150, 300]);
      }
    }, 200);
  }, []);

  useEffect(() => () => {
    stopTick();
    runRef.current++;
    cancelRestEnd();
  }, []);

  const pickDuration = (sec) => {
    setDuration(sec);
    begin(sec * 1000, sec); // one tap = start resting
  };

  const pause = () => {
    stopTick();
    runRef.current++;
    cancelRestEnd();
    setRemainingMs(Math.max(0, endAtRef.current - Date.now()));
    setStatus('paused');
  };

  const reset = () => {
    stopTick();
    runRef.current++;
    cancelRestEnd();
    setStatus('idle');
    setRemainingMs(duration * 1000);
  };

  const mainAction = () => {
    if (status === 'running') pause();
    else if (status === 'paused') begin(remainingMs, duration);
    else begin(duration * 1000, duration); // idle or done
  };

  const secondsLeft = Math.ceil(remainingMs / 1000);
  const progress = status === 'done' ? 0 : remainingMs / (duration * 1000);

  const mainLabel = {
    idle: 'Start rest',
    running: 'Pause',
    paused: 'Resume',
    done: 'Rest again',
  }[status];
  const mainIcon = status === 'running' ? 'pause' : status === 'paused' ? 'play' : status === 'done' ? 'refresh' : 'play';

  const caption = {
    idle: 'Ready',
    running: 'Resting',
    paused: 'Paused',
    done: 'Go! Next set',
  }[status];

  return (
    <Screen>
      <Header title="Rest timer" subtitle="You train, we keep time. Tap a duration to start resting." />

      <Card hero style={{ alignItems: 'center', paddingVertical: 30 }}>
        <Ring size={264} stroke={12} progress={status === 'idle' ? 1 : progress} knob={status !== 'idle' && status !== 'done'}>
          <Text style={[s.time, mono, status === 'done' && { color: colors.teal }]}>
            {status === 'done' ? '0:00' : fmt(secondsLeft)}
          </Text>
          <Label color={status === 'done' ? colors.teal : colors.textMuted} style={{ marginTop: 6 }}>
            {caption}
          </Label>
        </Ring>

        <View style={s.controls}>
          <PrimaryButton
            label={mainLabel}
            icon={mainIcon}
            onPress={mainAction}
            style={{ flex: 1 }}
          />
          <Pressable
            onPress={reset}
            disabled={status === 'idle'}
            style={({ pressed }) => [s.resetBtn, status === 'idle' && { opacity: 0.35 }, pressed && { opacity: 0.7 }]}
            accessibilityLabel="Reset timer"
          >
            <Ionicons name="stop" size={20} color={colors.text} />
          </Pressable>
        </View>
      </Card>

      <Label style={{ marginBottom: 12, marginLeft: 4 }}>Rest duration</Label>
      <View style={s.grid}>
        {DURATIONS.map((sec) => {
          const active = sec === duration;
          return (
            <Pressable
              key={sec}
              onPress={() => pickDuration(sec)}
              style={({ pressed }) => [s.tile, active && s.tileActive, pressed && { opacity: 0.8 }]}
            >
              <Text style={[s.tileTime, mono, active && { color: colors.teal }]}>{fmt(sec)}</Text>
              <Text style={s.tileSub}>{sec} seconds</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={s.hint}>
        You'll get a notification when your rest ends, even with the screen locked.
      </Text>
    </Screen>
  );
}

const s = StyleSheet.create({
  time: { color: colors.text, fontSize: 64, fontWeight: '300', letterSpacing: -2 },
  controls: { flexDirection: 'row', gap: 12, marginTop: 28, alignSelf: 'stretch' },
  resetBtn: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: colors.surfaceHi,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '48%', flexGrow: 1, backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border, paddingVertical: 22, paddingHorizontal: 18,
  },
  tileActive: { borderColor: colors.borderTeal, backgroundColor: 'rgba(45,226,208,0.07)' },
  tileTime: { color: colors.text, fontSize: 34, fontWeight: '300', letterSpacing: -1 },
  tileSub: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  hint: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 20, lineHeight: 18 },
});
