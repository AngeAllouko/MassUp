import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLE_PROFIL = 'massup_profil';
const CLE_JOURNEE = 'massup_journee';
const CLE_REPAS = 'massup_repas';
const CLE_POIDS = 'massup_poids';
const CLE_DATE = 'massup_date';
const CLE_NOTIFICATIONS = 'massup_notifications';

const dateAujourdhui = () => new Date().toISOString().split('T')[0];

function calculerObjectifs(profil) {
  const poids = parseFloat(profil.poids);
  const taille = parseFloat(profil.taille);
  const age = parseFloat(profil.age);
  const MB = 88.36 + 13.4 * poids + 4.8 * taille - 5.7 * age;
  const coefficients = { debutant: 1.375, intermediaire: 1.55, avance: 1.725 };
  const calories = Math.round(MB * (coefficients[profil.niveau] || 1.375) + 300);
  const proteines = Math.round(poids * 2);
  const lipides = Math.round((calories * 0.25) / 9);
  const glucides = Math.round((calories - proteines * 4 - lipides * 9) / 4);
  const hydratation = Math.round(poids * 35);
  return { calories, proteines, glucides, lipides, hydratation };
}

const useStore = create((set, get) => ({

  // Profil
  profil: { nom: '', poids: '', taille: '', age: '', niveau: 'debutant' },
  profilComplet: false,

  // Objectifs
  objectifs: { calories: 0, proteines: 0, glucides: 0, lipides: 0, hydratation: 0 },

  // Journée
  journee: {
    caloriesConsommees: 0,
    proteinesConsommees: 0,
    glucidesConsommes: 0,
    lipidesConsommes: 0,
    eauConsommee: 0,
  },

  // Repas et poids
  repas: [],
  historiquePoids: [],

  // Notifications
  notificationsActives: { hydratation: false, seance: false, bilan: false },

  // Chargement initial
  charger: async () => {
    try {
      const dateSauvegardee = await AsyncStorage.getItem(CLE_DATE);
      const aujourdhui = dateAujourdhui();

      const [profilSauve, poidsSauve, notifsSauvees] = await Promise.all([
        AsyncStorage.getItem(CLE_PROFIL),
        AsyncStorage.getItem(CLE_POIDS),
        AsyncStorage.getItem(CLE_NOTIFICATIONS),
      ]);

      let journeeSauvee = null;
      let repasSauves = null;

      if (dateSauvegardee === aujourdhui) {
        const [j, r] = await Promise.all([
          AsyncStorage.getItem(CLE_JOURNEE),
          AsyncStorage.getItem(CLE_REPAS),
        ]);
        journeeSauvee = j;
        repasSauves = r;
      } else {
        await AsyncStorage.setItem(CLE_DATE, aujourdhui);
        await AsyncStorage.removeItem(CLE_JOURNEE);
        await AsyncStorage.removeItem(CLE_REPAS);
      }

      if (profilSauve) {
        const profil = JSON.parse(profilSauve);
        const objectifs = calculerObjectifs(profil);
        set({ profil, profilComplet: true, objectifs });
      }

      if (journeeSauvee) set({ journee: JSON.parse(journeeSauvee) });
      if (repasSauves) set({ repas: JSON.parse(repasSauves) });
      if (poidsSauve) set({ historiquePoids: JSON.parse(poidsSauve) });
      if (notifsSauvees) set({ notificationsActives: JSON.parse(notifsSauvees) });

    } catch (e) {
      console.error('Erreur chargement:', e);
    }
  },

  // Actions profil
  setProfil: async (nouveauProfil) => {
    const objectifs = calculerObjectifs(nouveauProfil);
    set({ profil: nouveauProfil, profilComplet: true, objectifs });
    try {
      await AsyncStorage.setItem(CLE_PROFIL, JSON.stringify(nouveauProfil));
    } catch (e) {
      console.error('Erreur sauvegarde profil:', e);
    }
  },

  // Actions repas
  ajouterRepas: async (repas) => {
    const state = get();
    const nouveauxRepas = [...state.repas, repas];
    const nouvelleJournee = {
      ...state.journee,
      caloriesConsommees: state.journee.caloriesConsommees + repas.calories,
      proteinesConsommees: state.journee.proteinesConsommees + repas.proteines,
      glucidesConsommes: state.journee.glucidesConsommes + repas.glucides,
      lipidesConsommes: state.journee.lipidesConsommes + repas.lipides,
    };
    set({ repas: nouveauxRepas, journee: nouvelleJournee });
    try {
      await Promise.all([
        AsyncStorage.setItem(CLE_REPAS, JSON.stringify(nouveauxRepas)),
        AsyncStorage.setItem(CLE_JOURNEE, JSON.stringify(nouvelleJournee)),
      ]);
    } catch (e) {
      console.error('Erreur sauvegarde repas:', e);
    }
  },

  supprimerRepas: async (index) => {
    const state = get();
    const repasASupprimer = state.repas[index];
    const nouveauxRepas = state.repas.filter((_, i) => i !== index);
    const nouvelleJournee = {
      ...state.journee,
      caloriesConsommees: Math.max(0, state.journee.caloriesConsommees - repasASupprimer.calories),
      proteinesConsommees: Math.max(0, state.journee.proteinesConsommees - repasASupprimer.proteines),
      glucidesConsommes: Math.max(0, state.journee.glucidesConsommes - repasASupprimer.glucides),
      lipidesConsommes: Math.max(0, state.journee.lipidesConsommes - repasASupprimer.lipides),
    };
    set({ repas: nouveauxRepas, journee: nouvelleJournee });
    try {
      await Promise.all([
        AsyncStorage.setItem(CLE_REPAS, JSON.stringify(nouveauxRepas)),
        AsyncStorage.setItem(CLE_JOURNEE, JSON.stringify(nouvelleJournee)),
      ]);
    } catch (e) {
      console.error('Erreur suppression repas:', e);
    }
  },

  // Actions eau
  ajouterEau: async (quantite) => {
    const state = get();
    const nouvelleJournee = {
      ...state.journee,
      eauConsommee: state.journee.eauConsommee + quantite,
    };
    set({ journee: nouvelleJournee });
    try {
      await AsyncStorage.setItem(CLE_JOURNEE, JSON.stringify(nouvelleJournee));
    } catch (e) {
      console.error('Erreur sauvegarde eau:', e);
    }
  },

  // Actions poids
  ajouterPoids: async (valeur) => {
    const state = get();
    const nouvelHistorique = [
      ...state.historiquePoids,
      {
        valeur,
        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      },
    ];
    set({ historiquePoids: nouvelHistorique });
    try {
      await AsyncStorage.setItem(CLE_POIDS, JSON.stringify(nouvelHistorique));
    } catch (e) {
      console.error('Erreur sauvegarde poids:', e);
    }
  },

  // Actions notifications
  setNotificationsActives: async (cle, valeur) => {
    const state = get();
    const nouvelles = { ...state.notificationsActives, [cle]: valeur };
    set({ notificationsActives: nouvelles });
    try {
      await AsyncStorage.setItem(CLE_NOTIFICATIONS, JSON.stringify(nouvelles));
    } catch (e) {
      console.error('Erreur sauvegarde notifications:', e);
    }
  },

  // Reset journée
  resetJournee: async () => {
    const journeeVide = {
      caloriesConsommees: 0,
      proteinesConsommees: 0,
      glucidesConsommes: 0,
      lipidesConsommes: 0,
      eauConsommee: 0,
    };
    set({ journee: journeeVide, repas: [] });
    try {
      await Promise.all([
        AsyncStorage.removeItem(CLE_JOURNEE),
        AsyncStorage.removeItem(CLE_REPAS),
      ]);
    } catch (e) {
      console.error('Erreur reset journee:', e);
    }
  },

}));

export default useStore;