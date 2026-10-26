import * as Notifications from 'expo-notifications';

const REST_ID = 'rest_timer';

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // The rest timer already alerts inside the app, so only show it in the background.
    const isRest = notification.request.identifier === REST_ID;
    return {
      shouldShowBanner: !isRest,
      shouldShowList: !isRest,
      shouldPlaySound: !isRest,
      shouldSetBadge: false,
    };
  },
});

export async function requestPermissions() {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function cancelNotifications(prefix) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const n of scheduled) {
    if (n.identifier.startsWith(prefix)) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
  }
}

export async function sendTestNotification() {
  if (!(await requestPermissions())) return false;
  await Notifications.scheduleNotificationAsync({
    content: { title: 'MassUp', body: 'Notifications are working.' },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 3,
      repeats: false,
    },
  });
  return true;
}

export async function scheduleHydrationReminders() {
  await cancelNotifications('hydration');
  if (!(await requestPermissions())) return false;
  for (const hour of [8, 10, 12, 14, 16, 18, 20]) {
    await Notifications.scheduleNotificationAsync({
      identifier: `hydration_${hour}`,
      content: { title: 'Hydration', body: 'Time for some water to stay at your best.' },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute: 0,
      },
    });
  }
  return true;
}

export async function scheduleDailyRecap() {
  await cancelNotifications('recap');
  if (!(await requestPermissions())) return false;
  await Notifications.scheduleNotificationAsync({
    identifier: 'recap_evening',
    content: { title: 'Daily recap', body: 'Did you hit your targets today? Check your progress.' },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
  return true;
}

// Rest timer: a notification that fires when the rest ends (useful with the screen locked).
export async function scheduleRestEnd(seconds) {
  try {
    if (!(await requestPermissions())) return false;
    await Notifications.scheduleNotificationAsync({
      identifier: REST_ID,
      content: { title: 'Rest over', body: 'Time for your next set.' },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(1, Math.round(seconds)),
        repeats: false,
      },
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function cancelRestEnd() {
  try {
    await Notifications.cancelScheduledNotificationAsync(REST_ID);
  } catch (e) {
    // nothing scheduled
  }
}

// Removes reminders scheduled by older versions (French text, session reminders)
// and re-creates the enabled ones in English. Never prompts for permission.
export async function syncNotifications(enabled) {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;
  for (const prefix of ['hydratation', 'seance', 'bilan', 'hydration', 'recap']) {
    await cancelNotifications(prefix);
  }
  if (enabled.hydration) await scheduleHydrationReminders();
  if (enabled.recap) await scheduleDailyRecap();
}
