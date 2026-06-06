import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLE_PROFIL = 'massup_profil';
const CLE_JOURNEE = 'massup_journee';
const CLE_REPAS = 'massup_repas';
const CLE_POIDS = 'massup_poids';
const CLE_DATE = 'massup_date';

const dateAujourdhui = () => new Date().toISOString().split('T')[0];

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

  // Chargement initial
  charger: async () => {
    try {
      // Verifier et reset si nouveau jour
      const dateSauvegardee = await AsyncStorage.getItem(CLE_DATE);
      const aujourdhui = dateAujourdhui();

      const [profilSauve, poidsSauve] = await Promise.all([
        AsyncStorage.getItem(CLE_PROFIL),
        AsyncStorage.getItem(CLE_POIDS),
      ]);

      let journeeSauvee = null;
      let repasSauves = null;

      if (dateSauvegardee === aujourdhui) {
        // Meme jour : on charge les données du jour
        const [j, r] = await Promise.all([
          AsyncStorage.getItem(CLE_JOURNEE),
          AsyncStorage.getItem(CLE_REPAS),
        ]);
        journeeSauvee = j;
        repasSauves = r;
      } else {
        // Nouveau jour : on reset et on sauvegarde la nouvelle date
        await AsyncStorage.setItem(CLE_DATE, aujourdhui);
        await AsyncStorage.removeItem(CLE_JOURNEE);
        await AsyncStorage.removeItem(CLE_REPAS);
      }

      if (profilSauve) {
        const profil = JSON.parse(profilSauve);
        const objectifs = calculerObjectifs(profil);
        set({
          profil,
          profilComplet: true,
          objectifs,
        });
      }

      if (journeeSauvee) {
        set({ journee: JSON.parse(journeeSauvee) });
      }

      if (repasSauves) {
        set({ repas: JSON.parse(repasSauves) });
      }

      if (poidsSauve) {
        set({ historiquePoids: JSON.parse(poidsSauve) });
      }
    } catch (e) {
      console.error('Erreur chargement:', e);
    }
  },

  // Actions
  setProfil: async (nouveauProfil) => {
    const objectifs = calculerObjectifs(nouveauProfil);
    set({ profil: nouveauProfil, profilComplet: true, objectifs });
    try {
      await AsyncStorage.setItem(CLE_PROFIL, JSON.stringify(nouveauProfil));
    } catch (e) {
      console.error('Erreur sauvegarde profil:', e);
    }
  },

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
    caloriesConsommees: state.journee.caloriesConsommees - repasASupprimer.calories,
    proteinesConsommees: state.journee.proteinesConsommees - repasASupprimer.proteines,
    glucidesConsommes: state.journee.glucidesConsommes - repasASupprimer.glucides,
    lipidesConsommes: state.journee.lipidesConsommes - repasASupprimer.lipides,
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

export default useStore;