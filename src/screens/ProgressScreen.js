import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import useStore from '../store/useStore';

export default function ProgressScreen() {
  const profil = useStore((state) => state.profil);
  const objectifs = useStore((state) => state.objectifs);
  const journee = useStore((state) => state.journee);
  const historiquePoids = useStore((state) => state.historiquePoids);
  const ajouterPoids = useStore((state) => state.ajouterPoids);

  const [nouveauPoids, setNouveauPoids] = useState('');

  const handleAjouterPoids = () => {
    const val = parseFloat(nouveauPoids);
    if (!val || val < 30 || val > 300) {
      Alert.alert('Poids invalide', 'Entrez un poids valide en kg.');
      return;
    }
    ajouterPoids(val);
    setNouveauPoids('');
  };

  const poidsDebut = historiquePoids.length > 0 ? historiquePoids[0].valeur : parseFloat(profil.poids);
  const poidsActuel = historiquePoids.length > 0
    ? historiquePoids[historiquePoids.length - 1].valeur
    : parseFloat(profil.poids);
  const difference = (poidsActuel - poidsDebut).toFixed(1);

  const tauxCalories = objectifs.calories > 0
    ? Math.round((journee.caloriesConsommees / objectifs.calories) * 100)
    : 0;
  const tauxProteines = objectifs.proteines > 0
    ? Math.round((journee.proteinesConsommees / objectifs.proteines) * 100)
    : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.titre}>Progres</Text>

        {/* Carte poids */}
        <View style={styles.carte}>
          <Text style={styles.carteLabel}>Evolution du poids</Text>
          <View style={styles.poidsLigne}>
            <View style={styles.poidsItem}>
              <Text style={styles.poidsVal}>{poidsDebut} kg</Text>
              <Text style={styles.poidsLbl}>Depart</Text>
            </View>
            <View style={styles.flecheContainer}>
              <Text style={[styles.difference, { color: difference >= 0 ? '#4CAF50' : '#f44336' }]}>
                {difference >= 0 ? '+' : ''}{difference} kg
              </Text>
            </View>
            <View style={styles.poidsItem}>
              <Text style={styles.poidsVal}>{poidsActuel} kg</Text>
              <Text style={styles.poidsLbl}>Actuel</Text>
            </View>
          </View>

          {/* Graphique simple */}
          {historiquePoids.length > 1 && (
            <View style={styles.graphique}>
              {historiquePoids.slice(-7).map((p, i, arr) => {
                const min = Math.min(...arr.map((x) => x.valeur));
                const max = Math.max(...arr.map((x) => x.valeur));
                const range = max - min || 1;
                const hauteur = Math.round(((p.valeur - min) / range) * 60) + 10;
                return (
                  <View key={i} style={styles.barreGraphique}>
                    <Text style={styles.barreVal}>{p.valeur}</Text>
                    <View style={[styles.barreG, { height: hauteur }]} />
                    <Text style={styles.barreDate}>{p.date}</Text>
                  </View>
                );
              })}
            </View>
          )}

          <View style={styles.inputLigne}>
            <TextInput
              style={styles.input}
              placeholder="Nouveau poids (kg)"
              placeholderTextColor="#444"
              value={nouveauPoids}
              onChangeText={setNouveauPoids}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.boutonAjouter} onPress={handleAjouterPoids}>
              <Text style={styles.boutonAjouterTxt}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Objectifs du jour */}
        <View style={styles.carte}>
          <Text style={styles.carteLabel}>Objectifs du jour</Text>
          {[
            { label: 'Calories', val: tauxCalories, couleur: '#4CAF50' },
            { label: 'Proteines', val: tauxProteines, couleur: '#4CAF50' },
            {
              label: 'Hydratation',
              val: objectifs.hydratation > 0
                ? Math.round((journee.eauConsommee / objectifs.hydratation) * 100)
                : 0,
              couleur: '#2196F3',
            },
          ].map((o) => (
            <View key={o.label} style={styles.objectifItem}>
              <View style={styles.objectifHeader}>
                <Text style={styles.objectifLabel}>{o.label}</Text>
                <Text style={[styles.objectifPct, { color: o.couleur }]}>{Math.min(o.val, 100)}%</Text>
              </View>
              <View style={styles.barreContainer}>
                <View style={[styles.barre, { width: `${Math.min(o.val, 100)}%`, backgroundColor: o.couleur }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Statistiques */}
        <View style={styles.carte}>
          <Text style={styles.carteLabel}>Statistiques</Text>
          <View style={styles.statsGrille}>
            {[
              { label: 'Objectif calorique', val: `${objectifs.calories} kcal` },
              { label: 'Proteines cible', val: `${objectifs.proteines}g / jour` },
              { label: 'Hydratation cible', val: `${objectifs.hydratation} ml` },
              { label: 'Niveau', val: profil.niveau },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statVal}>{s.val}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 16, paddingBottom: 40 },
  titre: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 16, marginTop: 8, letterSpacing: -0.5 },
  carte: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 12 },
  carteLabel: { fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 },
  poidsLigne: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  poidsItem: { alignItems: 'center' },
  poidsVal: { fontSize: 24, fontWeight: '800', color: '#fff' },
  poidsLbl: { fontSize: 12, color: '#555', marginTop: 4 },
  flecheContainer: { alignItems: 'center' },
  difference: { fontSize: 20, fontWeight: '800' },
  graphique: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 20, height: 80 },
  barreGraphique: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  barreVal: { fontSize: 9, color: '#555', marginBottom: 2 },
  barreG: { width: '100%', backgroundColor: '#4CAF50', borderRadius: 4 },
  barreDate: { fontSize: 8, color: '#444', marginTop: 3 },
  inputLigne: { flexDirection: 'row', gap: 10 },
  input: { flex: 1, backgroundColor: '#242424', borderRadius: 12, padding: 14, color: '#fff', fontSize: 15 },
  boutonAjouter: { backgroundColor: '#4CAF50', borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
  boutonAjouterTxt: { color: '#fff', fontWeight: '800', fontSize: 14 },
  objectifItem: { marginBottom: 14 },
  objectifHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  objectifLabel: { color: '#888', fontSize: 14 },
  objectifPct: { fontSize: 14, fontWeight: '700' },
  barreContainer: { height: 4, backgroundColor: '#242424', borderRadius: 2, overflow: 'hidden' },
  barre: { height: 4, borderRadius: 2 },
  statsGrille: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statItem: { width: '47%', backgroundColor: '#242424', borderRadius: 14, padding: 14 },
  statVal: { fontSize: 16, fontWeight: '800', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#555' },
});