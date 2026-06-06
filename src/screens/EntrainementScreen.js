import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const PROGRAMME = [
  {
    jour: 'Lundi',
    muscles: 'Poitrine & Triceps',
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
    exercices: [
      { nom: 'Marche 30 min', series: 1, reps: '30 min', repos: 0 },
      { nom: 'Etirements complets', series: 1, reps: '15 min', repos: 0 },
    ],
  },
  {
    jour: 'Jeudi',
    muscles: 'Jambes',
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
    muscles: 'Full body',
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
    exercices: [
      { nom: 'Repos complet', series: 0, reps: '', repos: 0 },
    ],
  },
];

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const JOURS_MAP = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function EntrainementScreen() {
  const jourActuel = JOURS_MAP[new Date().getDay()];
  const [jourSelectionne, setJourSelectionne] = useState(jourActuel);
  const [seanceCommencee, setSeanceCommencee] = useState(false);
  const [exerciceActif, setExerciceActif] = useState(null);

  const programme = PROGRAMME.find((p) => p.jour === jourSelectionne);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.titre}>Entrainement</Text>

        {/* Selecteur de jours */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.joursScroll}
          contentContainerStyle={styles.joursContainer}
        >
          {JOURS.map((j) => {
            const prog = PROGRAMME.find((p) => p.jour === j);
            const estRepos = prog?.muscles === 'Repos' || prog?.muscles === 'Repos actif';
            return (
              <TouchableOpacity
                key={j}
                style={[styles.jourBtn, jourSelectionne === j && styles.jourBtnActif]}
                onPress={() => {
                  setJourSelectionne(j);
                  setSeanceCommencee(false);
                  setExerciceActif(null);
                }}
              >
                <Text style={[styles.jourTxt, jourSelectionne === j && styles.jourTxtActif]}>
                  {j.slice(0, 3)}
                </Text>
                {j === jourActuel && <View style={styles.pointAujourdhui} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Info seance */}
        <View style={styles.carte}>
          <View style={styles.carteHeader}>
            <View>
              <Text style={styles.carteLabel}>{programme?.jour}</Text>
              <Text style={styles.seanceTitre}>{programme?.muscles}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeTxt}>{programme?.exercices.length} exercices</Text>
            </View>
          </View>

          {programme?.muscles !== 'Repos' && (
            <TouchableOpacity
              style={[styles.boutonSeance, seanceCommencee && styles.boutonSeanceActif]}
              onPress={() => setSeanceCommencee(!seanceCommencee)}
            >
              <Text style={styles.boutonSeanceTxt}>
                {seanceCommencee ? 'Seance en cours' : 'Commencer la seance'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Liste exercices */}
        {programme?.exercices.map((ex, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.exerciceCarte, exerciceActif === i && styles.exerciceCarteActif]}
            onPress={() => setExerciceActif(exerciceActif === i ? null : i)}
            disabled={!seanceCommencee}
          >
            <View style={styles.exerciceHeader}>
              <View style={styles.exerciceNumero}>
                <Text style={styles.exerciceNumeroTxt}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciceNom}>{ex.nom}</Text>
                {ex.series > 0 && (
                  <Text style={styles.exerciceDetail}>
                    {ex.series} series · {ex.reps} reps · {ex.repos}s repos
                  </Text>
                )}
              </View>
              {seanceCommencee && exerciceActif === i && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkTxt}>En cours</Text>
                </View>
              )}
            </View>

            {exerciceActif === i && ex.series > 0 && (
              <View style={styles.seriesContainer}>
                {Array.from({ length: ex.series }).map((_, s) => (
                  <View key={s} style={styles.serieLigne}>
                    <Text style={styles.serieLabel}>Serie {s + 1}</Text>
                    <Text style={styles.serieReps}>{ex.reps} reps</Text>
                    <Text style={styles.serieRepos}>{ex.repos}s</Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 16, paddingBottom: 40 },
  titre: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 16, marginTop: 8, letterSpacing: -0.5 },
  joursScroll: { marginBottom: 16 },
  joursContainer: { gap: 8, paddingRight: 16 },
  jourBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  jourBtnActif: { backgroundColor: '#4CAF50' },
  jourTxt: { color: '#555', fontSize: 13, fontWeight: '600' },
  jourTxtActif: { color: '#fff' },
  pointAujourdhui: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4CAF50',
    marginTop: 4,
  },
  carte: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 12 },
  carteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  carteLabel: { fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5 },
  seanceTitre: { fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 4, letterSpacing: -0.5 },
  badge: { backgroundColor: '#242424', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  badgeTxt: { color: '#666', fontSize: 12, fontWeight: '600' },
  boutonSeance: {
    backgroundColor: '#242424',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  boutonSeanceActif: { backgroundColor: '#4CAF50' },
  boutonSeanceTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  exerciceCarte: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  exerciceCarteActif: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  exerciceHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  exerciceNumero: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#242424',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exerciceNumeroTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  exerciceNom: { color: '#fff', fontSize: 15, fontWeight: '600' },
  exerciceDetail: { color: '#555', fontSize: 12, marginTop: 2 },
  checkBadge: { backgroundColor: '#4CAF50', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  checkTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  seriesContainer: { marginTop: 14, borderTopWidth: 1, borderTopColor: '#242424', paddingTop: 12 },
  serieLigne: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#242424' },
  serieLabel: { color: '#666', fontSize: 13 },
  serieReps: { color: '#fff', fontSize: 13, fontWeight: '600' },
  serieRepos: { color: '#555', fontSize: 13 },
});