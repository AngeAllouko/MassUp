import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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

export async function planifierRappelsHydratation() {
  await annulerNotifications('hydratation');
  const autorise = await demanderPermissions();
  if (!autorise) return;

  // Rappel toutes les 2h entre 8h et 20h
  const heures = [8, 10, 12, 14, 16, 18, 20];
  for (const heure of heures) {
    await Notifications.scheduleNotificationAsync({
      identifier: `hydratation_${heure}`,
      content: {
        title: 'Hydratation',
        body: 'N\'oublie pas de boire de l\'eau pour rester performant.',
        data: { type: 'hydratation' },
      },
      trigger: {
        hour: heure,
        minute: 0,
        repeats: true,
      },
    });
  }
}

export async function planifierRappelSeance(joursSemaine) {
  await annulerNotifications('seance');
  const autorise = await demanderPermissions();
  if (!autorise) return;

  // joursSemaine : tableau de numéros (1=lundi, 2=mardi...)
  for (const jour of joursSemaine) {
    await Notifications.scheduleNotificationAsync({
      identifier: `seance_${jour}`,
      content: {
        title: 'Seance du jour',
        body: 'C\'est l\'heure de s\'entrainer. Tu peux le faire !',
        data: { type: 'seance' },
      },
      trigger: {
        weekday: jour,
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });
  }
}

export async function planifierBilanJournalier() {
  await annulerNotifications('bilan');
  const autorise = await demanderPermissions();
  if (!autorise) return;

  await Notifications.scheduleNotificationAsync({
    identifier: 'bilan_soir',
    content: {
      title: 'Bilan du jour',
      body: 'As-tu atteint tes objectifs aujourd\'hui ? Vérifie ton bilan.',
      data: { type: 'bilan' },
    },
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
    },
  });
}

export async function annulerNotifications(type) {
  const planifiees = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of planifiees) {
    if (notif.identifier.startsWith(type)) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
}

export async function annulerToutesNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}