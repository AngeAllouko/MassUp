import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function demanderPermissions() {
  const { status: existant } = await Notifications.getPermissionsAsync();
  if (existant === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function testerNotificationImmediате() {
  const autorise = await demanderPermissions();
  if (!autorise) return false;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'MassUp',
      body: 'Les notifications fonctionnent correctement.',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
      seconds: 3,
      repeats: false,
    },
  });
  return true;
}

export async function planifierRappelsHydratation() {
  await annulerNotifications('hydratation');
  const autorise = await demanderPermissions();
  if (!autorise) return false;

  const heures = [8, 10, 12, 14, 16, 18, 20];
  for (const heure of heures) {
    await Notifications.scheduleNotificationAsync({
      identifier: `hydratation_${heure}`,
      content: {
        title: 'Hydratation',
        body: "N'oublie pas de boire de l'eau pour rester performant.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: heure,
        minute: 0,
      },
    });
  }
  return true;
}

export async function planifierRappelSeance() {
  await annulerNotifications('seance');
  const autorise = await demanderPermissions();
  if (!autorise) return false;

  const jours = [2, 3, 5, 6, 7];
  for (const jour of jours) {
    await Notifications.scheduleNotificationAsync({
      identifier: `seance_${jour}`,
      content: {
        title: 'Seance du jour',
        body: "C'est l'heure de t'entrainer. Tu peux le faire !",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: jour,
        hour: 9,
        minute: 0,
      },
    });
  }
  return true;
}

export async function planifierBilanJournalier() {
  await annulerNotifications('bilan');
  const autorise = await demanderPermissions();
  if (!autorise) return false;

  await Notifications.scheduleNotificationAsync({
    identifier: 'bilan_soir',
    content: {
      title: 'Bilan du jour',
      body: "As-tu atteint tes objectifs aujourd'hui ? Vérifie ton bilan.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
  return true;
}

export async function annulerNotifications(type) {
  const planifiees = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of planifiees) {
    if (notif.identifier.startsWith(type)) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}