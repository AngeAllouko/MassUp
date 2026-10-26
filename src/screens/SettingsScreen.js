import React, { useState } from 'react';
import { View, Text, Alert, Switch, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';
import {
  scheduleHydrationReminders, scheduleDailyRecap, cancelNotifications, sendTestNotification,
} from '../services/notifications';
import { exportDailyReport } from '../services/export';
import { Screen, Header, Card, Label, Field, Segmented, PrimaryButton, IconButton, mono } from '../components/ui';
import { LEVEL_OPTIONS } from './ProfileScreen';
import { colors } from '../theme';

export default function SettingsScreen({ navigation }) {
  const profile = useStore((s) => s.profile);
  const targets = useStore((s) => s.targets);
  const day = useStore((s) => s.day);
  const meals = useStore((s) => s.meals);
  const weightHistory = useStore((s) => s.weightHistory);
  const setProfile = useStore((s) => s.setProfile);
  const resetDay = useStore((s) => s.resetDay);
  const enabled = useStore((s) => s.notificationsEnabled);
  const setNotificationEnabled = useStore((s) => s.setNotificationEnabled);

  const [name, setName] = useState(profile.name);
  const [weight, setWeight] = useState(String(profile.weight));
  const [height, setHeight] = useState(String(profile.height));
  const [age, setAge] = useState(String(profile.age));
  const [level, setLevel] = useState(profile.level);
  const [dirty, setDirty] = useState(false);
  const [exporting, setExporting] = useState(false);

  const edit = (setter) => (v) => { setter(v); setDirty(true); };

  const save = () => {
    if (!name.trim() || !weight || !height || !age) {
      Alert.alert('Missing fields', 'Please fill in every field.');
      return;
    }
    setProfile({ name: name.trim(), weight, height, age, level });
    setDirty(false);
    Alert.alert('Saved', 'Your profile and targets have been updated.');
  };

  const confirmReset = () =>
    Alert.alert('Reset today', 'Set all of today\'s counters back to zero?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetDay() },
    ]);

  const toggle = async (key, value) => {
    setNotificationEnabled(key, value);
    try {
      if (value) {
        const ok = key === 'hydration' ? await scheduleHydrationReminders() : await scheduleDailyRecap();
        if (!ok) {
          setNotificationEnabled(key, false);
          Alert.alert('Permission needed', 'Enable notifications for MassUp in your device settings.');
        }
      } else {
        await cancelNotifications(key);
      }
    } catch (e) {
      Alert.alert('Notification error', e.message);
    }
  };

  const testNotification = async () => {
    try {
      const ok = await sendTestNotification();
      if (ok) Alert.alert('Test sent', 'Put the app in the background. You will get a notification in 3 seconds.');
      else Alert.alert('Permission denied', 'Enable notifications for MassUp in your device settings.');
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  const share = async () => {
    setExporting(true);
    try {
      await exportDailyReport({ profile, targets, day, meals, weightHistory });
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not export your report.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Screen tabPad={false}>
      <Header title="Settings" right={<IconButton name="close" onPress={() => navigation.goBack()} />} />

      <Card hero>
        <Label color={colors.teal} style={{ marginBottom: 16 }}>My profile</Label>
        <Field label="First name" value={name} onChangeText={edit(setName)} />
        <View style={s.row}>
          <Field style={{ flex: 1 }} label="Weight" suffix="kg" value={weight} onChangeText={edit(setWeight)} keyboardType="decimal-pad" />
          <Field style={{ flex: 1 }} label="Height" suffix="cm" value={height} onChangeText={edit(setHeight)} keyboardType="numeric" />
        </View>
        <Field label="Age" suffix="years" value={age} onChangeText={edit(setAge)} keyboardType="numeric" />
        <Text style={s.fieldLabel}>Training level</Text>
        <Segmented options={LEVEL_OPTIONS} value={level} onChange={edit(setLevel)} style={{ marginBottom: dirty ? 18 : 0 }} />
        {dirty && <PrimaryButton label="Save changes" icon="checkmark" onPress={save} />}
      </Card>

      <Card>
        <Label style={{ marginBottom: 12 }}>Current targets</Label>
        {[
          { l: 'Calories', v: `${targets.calories} kcal`, c: colors.teal },
          { l: 'Protein', v: `${targets.protein} g`, c: colors.protein },
          { l: 'Carbs', v: `${targets.carbs} g`, c: colors.carbs },
          { l: 'Fat', v: `${targets.fat} g`, c: colors.fat },
          { l: 'Hydration', v: `${targets.water} ml`, c: colors.water },
        ].map((t) => (
          <View key={t.l} style={s.targetRow}>
            <Text style={s.targetLabel}>{t.l}</Text>
            <Text style={[s.targetVal, mono, { color: t.c }]}>{t.v}</Text>
          </View>
        ))}
      </Card>

      <Card>
        <Label style={{ marginBottom: 6 }}>Notifications</Label>
        {[
          { key: 'hydration', label: 'Hydration reminders', desc: 'Every 2 hours, 8:00 to 20:00' },
          { key: 'recap', label: 'Daily recap', desc: 'Every evening at 20:00' },
        ].map((n) => (
          <View key={n.key} style={s.notifRow}>
            <View style={{ flex: 1 }}>
              <Text style={s.notifLabel}>{n.label}</Text>
              <Text style={s.notifDesc}>{n.desc}</Text>
            </View>
            <Switch
              value={!!enabled[n.key]}
              onValueChange={(v) => toggle(n.key, v)}
              trackColor={{ false: colors.surfaceHi, true: 'rgba(45,226,208,0.45)' }}
              thumbColor={enabled[n.key] ? colors.teal : colors.textMuted}
            />
          </View>
        ))}
        <PrimaryButton
          label="Send a test notification"
          icon="notifications-outline"
          variant="ghost"
          onPress={testNotification}
          style={{ marginTop: 8 }}
        />
      </Card>

      <Card style={{ paddingVertical: 6 }}>
        <ActionRow icon="refresh-outline" color={colors.carbs} title="Reset today" desc="Set today's counters back to zero" onPress={confirmReset} />
        <View style={s.sep} />
        <ActionRow
          icon="share-outline"
          color={colors.teal}
          title={exporting ? 'Exporting…' : 'Export my report'}
          desc="Share a summary of your day"
          onPress={share}
          disabled={exporting}
        />
      </Card>

      <Text style={s.version}>MassUp v1.0.0</Text>
    </Screen>
  );
}

function ActionRow({ icon, color, title, desc, onPress, disabled }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [s.action, pressed && { opacity: 0.7 }]}>
      <View style={[s.actionIcon, { backgroundColor: `${color}1F` }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.actionTitle}>{title}</Text>
        <Text style={s.actionDesc}>{desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  fieldLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '600', marginBottom: 7 },
  targetRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9 },
  targetLabel: { color: colors.textMuted, fontSize: 14 },
  targetVal: { fontSize: 15 },
  notifRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  notifLabel: { color: colors.text, fontSize: 15, fontWeight: '700' },
  notifDesc: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  actionIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  actionTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  actionDesc: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  sep: { height: 1, backgroundColor: colors.border },
  version: { color: colors.textFaint, fontSize: 12, textAlign: 'center', marginTop: 10 },
});
