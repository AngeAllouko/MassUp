import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Vibration,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PROGRAMME = [
  {
    jour: 'Lundi',
    muscles: 'Poitrine & Triceps',
    couleur: '#4CAF50',
    exercices: [
      { nom: 'Pompes classiques', series: 4, reps: '12-15', repos: 60 },
      { nom: 'Pompes larges', series: 3, reps: '10-12', repos: 60 },
      { nom: 'Pompes diamant', series: 3, reps: '10-12', repos: 60 },
      { nom: 'Dips sur chaise', series: 3, reps: '12-15', repos: 60 },
      { nom: 'Pompes declinées', series: 3, reps: '10-12', repos: 60 },
    ],
  },
  {
    jour: 'Mardi',
    muscles: 'Dos & Biceps',
    couleur: '#2196F3',
    exercices: [
      { nom: 'Tractions (ou pulls sur table)', series: 4, reps: '8-10', repos: 90 },
      { nom: 'Rowing avec sac leste', series: 3, reps: '12-15', repos: 60 },
      { nom: 'Superman', series: 3, reps: '15', repos: 45 },
      { nom: 'Curls avec bouteilles', series: 3, reps: '15', repos: 45 },
      { nom: 'Curl marteau', series: 3, reps: '12', repos: 45 },
    ],
  },
  {
    jour: 'Mercredi',
    muscles: 'Repos actif',
    couleur: '#555',
    exercices: [
      { nom: 'Marche 30 min', series: 1, reps: '30 min', repos: 0 },
      { nom: 'Etirements complets', series: 1, reps: '15 min', repos: 0 },
    ],
  },
  {
    jour: 'Jeudi',
    muscles: 'Jambes',
    couleur: '#FF9800',
    exercices: [
      { nom: 'Squats', series: 4, reps: '15-20', repos: 60 },
      { nom: 'Fentes avant', series: 3, reps: '12 chaque', repos: 60 },
      { nom: 'Squats sumo', series: 3, reps: '15', repos: 60 },
      { nom: 'Pont fessier', series: 4, reps: '20', repos: 45 },
      { nom: 'Mollets debout', series: 4, reps: '20-25', repos: 30 },
    ],
  },
  {
    jour: 'Vendredi',
    muscles: 'Epaules & Abdos',
    couleur: '#9C27B0',
    exercices: [
      { nom: 'Pompes pike', series: 4, reps: '10-12', repos: 60 },
      { nom: 'Elevation laterale bouteilles', series: 3, reps: '15', repos: 45 },
      { nom: 'Planche', series: 3, reps: '45 sec', repos: 45 },
      { nom: 'Crunchs', series: 3, reps: '20', repos: 30 },
      { nom: 'Relevés de jambes', series: 3, reps: '15', repos: 30 },
    ],
  },
  {
    jour: 'Samedi',
    muscles: 'Full Body',
    couleur: '#E91E63',
    exercices: [
      { nom: 'Burpees', series: 3, reps: '10', repos: 60 },
      { nom: 'Pompes', series: 3, reps: '12', repos: 45 },
      { nom: 'Squats', series: 3, reps: '15', repos: 45 },
      { nom: 'Mountain climbers', series: 3, reps: '20', repos: 45 },
      { nom: 'Planche', series: 3, reps: '45 sec', repos: 30 },
    ],
  },
  {
    jour: 'Dimanche',
    muscles: 'Repos',
    couleur: '#333',
    exercices: [],
  },
];

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const JOURS_MAP = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

function Chronometre({ duree, onTermine }) {
  const [restant, setRestant] = useState(duree);
  const animLargeur = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef(null);

  useEffect(() => {
    Animated.timing(animLargeur, {
      toValue: 0,
      duration: duree * 1000,
      useNativeDriver: false,
    }).start();

    intervalRef.current = setInterval(() => {
      setRestant((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          Vibration.vibrate([0, 200, 100, 200]);
          onTermine();
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const minutes = Math.floor(restant / 60);
  const secondes = restant % 60;

  return (
    <View style={chrono.container}>
      <View style={chrono.header}>
        <Ionicons name="timer-outline" size={16} color="#FF9800" />
        <Text style={chrono.titre}>Temps de repos</Text>
      </View>
      <Text style={chrono.temps}>
        {minutes > 0 ? `${minutes}:${secondes.toString().padStart(2, '0')}` : `${restant}s`}
      </Text>
      <View style={chrono.barreContainer}>
        <Animated.View style={[chrono.barre, { width: animLargeur.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
      </View>
      <TouchableOpacity style={chrono.boutonPasser} onPress={onTermine}>
        <Text style={chrono.boutonPasserTxt}>Passer</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function EntrainementScreen() {
  const jourActuel = JOURS_MAP[new Date().getDay()];
  const [jourSelectionne, setJourSelectionne] = useState(jourActuel);
  const [seanceCommencee, setSeanceCommencee] = useState(false);
  const [seriesValidees, setSeriesValidees] = useState({});
  const [chronoActif, setChronoActif] = useState(null);

  const programme = PROGRAMME.find((p) => p.jour === jourSelectionne);
  const estRepos = programme?.muscles === 'Repos' || programme?.muscles === 'Repos actif';

  const totalSeries = programme?.exercices.reduce((acc, ex) => acc + ex.series, 0) || 0;
  const seriesValidéesCount = Object.values(seriesValidees).flat().length;
  const progression = totalSeries > 0 ? Math.round((seriesValidéesCount / totalSeries) * 100) : 0;

  const handleValiderSerie = (exIndex, serieIndex, repos) => {
    const cle = `${exIndex}`;
    const actuel = seriesValidees[cle] || [];
    if (actuel.includes(serieIndex)) return;
    setSeriesValidees((prev) => ({ ...prev, [cle]: [...actuel, serieIndex] }));
    if (repos > 0) {
      setChronoActif({ duree: repos, exIndex, serieIndex });
    }
  };

  const handleChangerJour = (j) => {
    setJourSelectionne(j);
    setSeanceCommencee(false);
    setSeriesValidees({});
    setChronoActif(null);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.titre}>Entrainement</Text>

        {/* Selecteur de jours */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.joursScroll} contentContainerStyle={styles.joursContainer}>
          {JOURS.map((j) => {
            const prog = PROGRAMME.find((p) => p.jour === j);
            const estActif = jourSelectionne === j;
            return (
              <TouchableOpacity
                key={j}
                style={[styles.jourBtn, estActif && { backgroundColor: prog?.couleur || '#4CAF50' }]}
                onPress={() => handleChangerJour(j)}
              >
                <Text style={[styles.jourTxt, estActif && styles.jourTxtActif]}>{j.slice(0, 3)}</Text>
                {j === jourActuel && <View style={[styles.point, { backgroundColor: estActif ? '#fff' : prog?.couleur || '#4CAF50' }]} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Carte seance */}
        <View style={[styles.carteHero, { overflow: 'hidden' }]}>
          <View style={[styles.glow, { backgroundColor: programme?.couleur || '#4CAF50' }]} />
          <View style={styles.carteHeroHeader}>
            <View>
              <Text style={styles.carteLabel}>{programme?.jour}</Text>
              <Text style={styles.seanceTitre}>{programme?.muscles}</Text>
            </View>
            {!estRepos && (
              <View style={styles.badgeExercices}>
                <Text style={styles.badgeExercicesTxt}>{programme?.exercices.length} exercices</Text>
              </View>
            )}
          </View>

          {/* Barre de progression */}
          {seanceCommencee && !estRepos && (
            <View style={styles.progressionContainer}>
              <View style={styles.progressionHeader}>
                <Text style={styles.progressionLabel}>Progression</Text>
                <Text style={[styles.progressionPct, { color: programme?.couleur }]}>{progression}%</Text>
              </View>
              <View style={styles.barreContainer}>
                <Animated.View style={[styles.barre, { width: `${progression}%`, backgroundColor: programme?.couleur }]} />
              </View>
              <Text style={styles.progressionDetail}>{seriesValidéesCount} / {totalSeries} séries</Text>
            </View>
          )}

          {!estRepos && (
            <TouchableOpacity
              style={[styles.boutonSeance, seanceCommencee && { backgroundColor: programme?.couleur }]}
              onPress={() => {
                if (seanceCommencee) {
                  setSeanceCommencee(false);
                  setSeriesValidees({});
                  setChronoActif(null);
                } else {
                  setSeanceCommencee(true);
                }
              }}
            >
              <Ionicons name={seanceCommencee ? 'stop-circle-outline' : 'play-circle-outline'} size={18} color="#fff" />
              <Text style={styles.boutonSeanceTxt}>
                {seanceCommencee ? 'Arreter la seance' : 'Commencer la seance'}
              </Text>
            </TouchableOpacity>
          )}

          {estRepos && (
            <View style={styles.reposMessage}>
              <Ionicons name="moon-outline" size={20} color="#555" />
              <Text style={styles.reposTxt}>Profites-en pour récupérer</Text>
            </View>
          )}
        </View>

        {/* Chronometre */}
        {chronoActif && (
          <Chronometre
            duree={chronoActif.duree}
            onTermine={() => setChronoActif(null)}
          />
        )}

        {/* Liste exercices */}
        {programme?.exercices.map((ex, exIndex) => {
          const seriesEx = seriesValidees[`${exIndex}`] || [];
          const toutesValidees = seriesEx.length === ex.series;

          return (
            <View key={exIndex} style={[styles.exerciceCarte, toutesValidees && styles.exerciceCarteComplete]}>
              <View style={styles.exerciceHeader}>
                <View style={[styles.exerciceNumero, toutesValidees && { backgroundColor: programme?.couleur }]}>
                  {toutesValidees
                    ? <Ionicons name="checkmark" size={16} color="#fff" />
                    : <Text style={styles.exerciceNumeroTxt}>{exIndex + 1}</Text>
                  }
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciceNom}>{ex.nom}</Text>
                  {ex.series > 0 && (
                    <Text style={styles.exerciceDetail}>{ex.series} series · {ex.reps} reps · {ex.repos}s repos</Text>
                  )}
                </View>
              </View>

              {/* Series */}
              {seanceCommencee && ex.series > 0 && (
                <View style={styles.seriesContainer}>
                  {Array.from({ length: ex.series }).map((_, serieIndex) => {
                    const estValidee = seriesEx.includes(serieIndex);
                    const estChrono = chronoActif?.exIndex === exIndex && chronoActif?.serieIndex === serieIndex;
                    return (
                      <TouchableOpacity
                        key={serieIndex}
                        style={[styles.serieLigne, estValidee && styles.serieLigneValidee]}
                        onPress={() => !estValidee && handleValiderSerie(exIndex, serieIndex, ex.repos)}
                        disabled={estValidee}
                      >
                        <View style={[styles.serieCheck, estValidee && { backgroundColor: programme?.couleur, borderColor: programme?.couleur }]}>
                          {estValidee && <Ionicons name="checkmark" size={12} color="#fff" />}
                        </View>
                        <Text style={[styles.serieLabel, estValidee && { color: '#fff' }]}>Serie {serieIndex + 1}</Text>
                        <Text style={[styles.serieReps, estValidee && { color: programme?.couleur }]}>{ex.reps} reps</Text>
                        <Text style={styles.serieRepos}>{ex.repos}s</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
}

const chrono = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,152,0,0.1)', borderRadius: 20, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,152,0,0.25)',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  titre: { color: '#FF9800', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  temps: { fontSize: 48, fontWeight: '900', color: '#fff', letterSpacing: -2, marginBottom: 12 },
  barreContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 12 },
  barre: { height: 4, backgroundColor: '#FF9800', borderRadius: 2 },
  boutonPasser: { alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  boutonPasserTxt: { color: '#888', fontSize: 13, fontWeight: '600' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 16, paddingBottom: 100 },
  titre: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 16, marginTop: 8, letterSpacing: -0.5 },

  joursScroll: { marginBottom: 16 },
  joursContainer: { gap: 8, paddingRight: 16 },
  jourBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, backgroundColor: '#1a1a1a', alignItems: 'center' },
  jourTxt: { color: '#555', fontSize: 13, fontWeight: '600' },
  jourTxtActif: { color: '#fff' },
  point: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },

  carteHero: {
    backgroundColor: 'rgba(26,26,26,0.8)', borderRadius: 24, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
  },
  glow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, opacity: 0.08, top: -40, right: -30 },
  carteHeroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  carteLabel: { fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5 },
  seanceTitre: { fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 4, letterSpacing: -0.5 },
  badgeExercices: { backgroundColor: '#242424', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  badgeExercicesTxt: { color: '#666', fontSize: 12, fontWeight: '600' },

  progressionContainer: { marginBottom: 16 },
  progressionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressionLabel: { color: '#555', fontSize: 12 },
  progressionPct: { fontSize: 12, fontWeight: '700' },
  barreContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  barre: { height: 4, borderRadius: 2 },
  progressionDetail: { color: '#444', fontSize: 11, marginTop: 2 },

  boutonSeance: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#242424', borderRadius: 14, padding: 14,
  },
  boutonSeanceTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },

  reposMessage: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 8 },
  reposTxt: { color: '#555', fontSize: 14 },

  exerciceCarte: {
    backgroundColor: 'rgba(26,26,26,0.8)', borderRadius: 18, padding: 16, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)',
  },
  exerciceCarteComplete: { borderColor: 'rgba(76,175,80,0.2)', backgroundColor: 'rgba(76,175,80,0.04)' },
  exerciceHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  exerciceNumero: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#242424', justifyContent: 'center', alignItems: 'center' },
  exerciceNumeroTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  exerciceNom: { color: '#fff', fontSize: 15, fontWeight: '600' },
  exerciceDetail: { color: '#555', fontSize: 12, marginTop: 2 },

  seriesContainer: { marginTop: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.04)', paddingTop: 10, gap: 6 },
  serieLigne: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#1e1e1e', borderRadius: 10, padding: 12,
  },
  serieLigneValidee: { backgroundColor: 'rgba(255,255,255,0.03)' },
  serieCheck: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: '#333', justifyContent: 'center', alignItems: 'center' },
  serieLabel: { flex: 1, color: '#555', fontSize: 13 },
  serieReps: { color: '#888', fontSize: 13, fontWeight: '600' },
  serieRepos: { color: '#444', fontSize: 12 },
});