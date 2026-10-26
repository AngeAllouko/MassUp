import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_PROFILE = 'massup_profil';
const KEY_DAY = 'massup_journee';
const KEY_MEALS = 'massup_repas';
const KEY_WEIGHT = 'massup_poids';
const KEY_DATE = 'massup_date';
const KEY_NOTIFS = 'massup_notifications';

const EMPTY_DAY = { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 };

const pad = (n) => String(n).padStart(2, '0');
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const ACTIVITY = { beginner: 1.375, intermediate: 1.55, advanced: 1.725 };

export function calculateTargets(profile) {
  const weight = parseFloat(profile.weight);
  const height = parseFloat(profile.height);
  const age = parseFloat(profile.age);
  const bmr = 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age;
  const calories = Math.round(bmr * (ACTIVITY[profile.level] || 1.375) + 300);
  const protein = Math.round(weight * 2);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  const water = Math.round(weight * 35);
  return { calories, protein, carbs, fat, water };
}

/* ---- Migration of data saved by the previous (French) version ---- */
const LEVELS = { debutant: 'beginner', intermediaire: 'intermediate', avance: 'advanced' };

const migrateProfile = (p) => ({
  name: p.name ?? p.nom ?? '',
  weight: p.weight ?? p.poids ?? '',
  height: p.height ?? p.taille ?? '',
  age: p.age ?? '',
  level: LEVELS[p.level ?? p.niveau] ?? p.level ?? 'beginner',
});

const migrateDay = (j) => ({
  calories: j.calories ?? j.caloriesConsommees ?? 0,
  protein: j.protein ?? j.proteinesConsommees ?? 0,
  carbs: j.carbs ?? j.glucidesConsommes ?? 0,
  fat: j.fat ?? j.lipidesConsommes ?? 0,
  water: j.water ?? j.eauConsommee ?? 0,
});

const migrateMeals = (list) =>
  list.map((r, i) => ({
    id: r.id ?? `legacy-${i}`,
    name: r.name ?? r.nom,
    grams: r.grams ?? r.quantite,
    calories: r.calories,
    protein: r.protein ?? r.proteines ?? 0,
    carbs: r.carbs ?? r.glucides ?? 0,
    fat: r.fat ?? r.lipides ?? 0,
  }));

const migrateWeights = (list) =>
  list.map((p) => ({ value: p.value ?? p.valeur, date: p.date }));

const save = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key}`, e);
  }
};

const useStore = create((set, get) => ({
  profile: { name: '', weight: '', height: '', age: '', level: 'beginner' },
  profileComplete: false,
  targets: { calories: 0, protein: 0, carbs: 0, fat: 0, water: 0 },
  day: { ...EMPTY_DAY },
  meals: [],
  weightHistory: [],
  notificationsEnabled: { hydration: false, recap: false },

  load: async () => {
    try {
      const savedDate = await AsyncStorage.getItem(KEY_DATE);
      const now = today();

      const [profileRaw, weightRaw, notifsRaw] = await Promise.all([
        AsyncStorage.getItem(KEY_PROFILE),
        AsyncStorage.getItem(KEY_WEIGHT),
        AsyncStorage.getItem(KEY_NOTIFS),
      ]);

      let dayRaw = null;
      let mealsRaw = null;
      if (savedDate === now) {
        [dayRaw, mealsRaw] = await Promise.all([
          AsyncStorage.getItem(KEY_DAY),
          AsyncStorage.getItem(KEY_MEALS),
        ]);
      } else {
        await AsyncStorage.setItem(KEY_DATE, now);
        await AsyncStorage.multiRemove([KEY_DAY, KEY_MEALS]);
      }

      if (profileRaw) {
        const profile = migrateProfile(JSON.parse(profileRaw));
        set({ profile, profileComplete: true, targets: calculateTargets(profile) });
      }
      if (dayRaw) set({ day: migrateDay(JSON.parse(dayRaw)) });
      if (mealsRaw) set({ meals: migrateMeals(JSON.parse(mealsRaw)) });
      if (weightRaw) set({ weightHistory: migrateWeights(JSON.parse(weightRaw)) });
      if (notifsRaw) {
        const n = JSON.parse(notifsRaw);
        set({
          notificationsEnabled: {
            hydration: !!n.hydration,
            recap: !!(n.recap ?? n.bilan),
          },
        });
      }
    } catch (e) {
      console.error('Failed to load data', e);
    }
  },

  setProfile: async (profile) => {
    set({ profile, profileComplete: true, targets: calculateTargets(profile) });
    await save(KEY_PROFILE, profile);
  },

  addMeal: async (meal) => {
    const { meals, day } = get();
    const nextMeals = [...meals, { id: `${Date.now()}`, ...meal }];
    const nextDay = {
      ...day,
      calories: day.calories + meal.calories,
      protein: Math.round((day.protein + meal.protein) * 10) / 10,
      carbs: Math.round((day.carbs + meal.carbs) * 10) / 10,
      fat: Math.round((day.fat + meal.fat) * 10) / 10,
    };
    set({ meals: nextMeals, day: nextDay });
    await Promise.all([save(KEY_MEALS, nextMeals), save(KEY_DAY, nextDay)]);
  },

  removeMeal: async (id) => {
    const { meals, day } = get();
    const meal = meals.find((m) => m.id === id);
    if (!meal) return;
    const nextMeals = meals.filter((m) => m.id !== id);
    const nextDay = {
      ...day,
      calories: Math.max(0, day.calories - meal.calories),
      protein: Math.max(0, Math.round((day.protein - meal.protein) * 10) / 10),
      carbs: Math.max(0, Math.round((day.carbs - meal.carbs) * 10) / 10),
      fat: Math.max(0, Math.round((day.fat - meal.fat) * 10) / 10),
    };
    set({ meals: nextMeals, day: nextDay });
    await Promise.all([save(KEY_MEALS, nextMeals), save(KEY_DAY, nextDay)]);
  },

  // Pass a negative amount to undo.
  addWater: async (ml) => {
    const { day } = get();
    const nextDay = { ...day, water: Math.max(0, day.water + ml) };
    set({ day: nextDay });
    await save(KEY_DAY, nextDay);
  },

  addWeight: async (value) => {
    const next = [
      ...get().weightHistory,
      { value, date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) },
    ];
    set({ weightHistory: next });
    await save(KEY_WEIGHT, next);
  },

  setNotificationEnabled: async (key, value) => {
    const next = { ...get().notificationsEnabled, [key]: value };
    set({ notificationsEnabled: next });
    await save(KEY_NOTIFS, next);
  },

  resetDay: async () => {
    set({ day: { ...EMPTY_DAY }, meals: [] });
    try {
      await AsyncStorage.multiRemove([KEY_DAY, KEY_MEALS]);
    } catch (e) {
      console.error('Failed to reset day', e);
    }
  },
}));

export default useStore;
