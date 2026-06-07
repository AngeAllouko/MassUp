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
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';

function GraphiquePoids({ donnees }) {
  if (donnees.length < 2) return null;

  const valeurs = donnees.map((d) => d.valeur);
  const min = Math.min(...valeurs) - 1;
  const max = Math.max(...valeurs) + 1;
  const range = max - min || 1;
  const HAUTEUR = 120;
  const LARGEUR_BARRE = 36;

  return (
    <View style={graphique.container}>
      {donnees.slice(-7).map((point, i, arr) => {
        const hauteur = Math.round(((point.valeur - min) / range) * HAUTEUR);
        const estDernier = i === arr.length - 1;
        const precedent = i > 0 ? arr[i - 1].valeur : null;
        const enHausse = precedent !== null && point.valeur >= precedent;

        return (
          <View key={i} style={graphique.colonne}>
            {estDernier && (
              <Text style={[graphique.valeurFlottante, { color: enHausse ? '#4CAF50' : '#f44336' }]}>
                {point.valeur}
              </Text>
            )}
            <View style={graphique.barreWrapper}>
              <View
                style={[
                  graphique.barre,
                  {
                    height: hauteur,
                    backgroundColor: estDernier
                      ? (enHausse ? '#4CAF50' : '#f44336')
                      : 'rgba(255,255,255,0.08)',
                    width: LARGEUR_BARRE,
                  },
                ]}
              />
            </View>
            <Text style={graphique.date}>{point.date}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default function ProgressScreen() {
  const profil = useStore((state) => state.profil);
  const objectifs = useStore((state) => state.objectifs);
  const journee = useStore((state) => state.journee);
  const historiquePoids = useStore((state) => state.historiquePoids);
  const ajouterPoids = useStore((state) => state.ajouterPoids);

  const [nouveauPoids, setNouveauPoids] = useState('');
  const [ongletActif, setOngletActif] = useState('poids');

  const handleAjouterPoids = () => {
    const val = parseFloat(nouveauPoids);
    if (!val || val < 30 || val > 300) {
      Alert.alert('Poids invalide', 'Entrez un poids valide en kg.');
      return;
    }
    ajouterPoids(val);
    setNouveauPoids('');
  };

  const poidsDebut = parseFloat(profil.poids);
  const poidsActuel = historiquePoids.length > 0
    ? historiquePoids[historiquePoids.length - 1].valeur
    : poidsDebut;
  const difference = (poidsActuel - poidsDebut).toFixed(1);
  const enHausse = parseFloat(difference) >= 0;

  const pct = (val, obj) => Math.min(Math.round((val / (obj || 1)) * 100), 100);

  const stats = [
    { label: 'Objectif calorique', val: `${objectifs.calories}`, unite: 'kcal/jour', couleur: '#4CAF50', icone: 'flame-outline' },
    { label: 'Proteines cibles', val: `${objectifs.proteines}`, unite: 'g/jour', couleur: '#4CAF50', icone: 'barbell-outline' },
    { label: 'Hydratation cible', val: `${objectifs.hydratation}`, unite: 'ml/jour', couleur: '#2196F3', icone: 'water-outline' },
    { label: 'Niveau', val: profil.niveau.charAt(0).toUpperCase() + profil.niveau.slice(1), unite: '', couleur: '#FF9800', icone: 'trophy-outline' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <Text style={styles.titre}>Progres</Text>

        {/* Onglets */}
        <View style={styles.onglets}>
          {[
            { id: 'poids', label: 'Poids' },
            { id: 'journee', label: 'Aujourd\'hui' },
            { id: 'stats', label: 'Stats' },
          ].map((o) => (
            <TouchableOpacity
              key={o.id}
              style={[styles.onglet, ongletActif === o.id && styles.ongletActif]}
              onPress={() => setOngletActif(o.id)}
            >
              <Text style={[styles.ongletTxt, ongletActif === o.id && styles.ongletTxtActif]}>
                {o.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Onglet Poids */}
        {ongletActif === 'poids' && (
          <>
            {/* Recap poids */}
            <View style={styles.carteHero}>
              <View style={styles.glowVert} />
              <Text style={styles.heroBadge}>EVOLUTION DU POIDS</Text>
              <View style={styles.poidsResume}>
                <View style={styles.poidsItem}>
                  <Text style={styles.poidsVal}>{poidsDebut}</Text>
                  <Text style={styles.poidsUnite}>kg</Text>
                  <Text style={styles.poidsLbl}>Départ</Text>
                </View>
                <View style={styles.poidsFleche}>
                  <Ionicons
                    name={enHausse ? 'trending-up' : 'trending-down'}
                    size={28}
                    color={enHausse ? '#4CAF50' : '#f44336'}
                  />
                  <Text style={[styles.difference, { color: enHausse ? '#4CAF50' : '#f44336' }]}>
                    {enHausse ? '+' : ''}{difference} kg
                  </Text>
                </View>
                <View style={styles.poidsItem}>
                  <Text style={styles.poidsVal}>{poidsActuel}</Text>
                  <Text style={styles.poidsUnite}>kg</Text>
                  <Text style={styles.poidsLbl}>Actuel</Text>
                </View>
              </View>

              <GraphiquePoids donnees={historiquePoids} />

              {historiquePoids.length < 2 && (
                <View style={styles.graphiqueVide}>
                  <Ionicons name="bar-chart-outline" size={32} color="#333" />
                  <Text style={styles.graphiqueVideTxt}>Ajoute au moins 2 pesées pour voir le graphique</Text>
                </View>
              )}
            </View>

            {/* Ajouter poids */}
            <View style={styles.carte}>
              <Text style={styles.carteLabel}>Nouvelle pesée</Text>
              <View style={styles.inputLigne}>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder={`Poids actuel (kg)`}
                    placeholderTextColor="#444"
                    value={nouveauPoids}
                    onChangeText={setNouveauPoids}
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputUnite}>kg</Text>
                </View>
                <TouchableOpacity style={styles.boutonAjouter} onPress={handleAjouterPoids}>
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Historique */}
            {historiquePoids.length > 0 && (
              <View style={styles.carte}>
                <Text style={styles.carteLabel}>Historique</Text>
                {[...historiquePoids].reverse().slice(0, 10).map((p, i) => (
                  <View key={i} style={styles.historiqueLigne}>
                    <View style={styles.historiquePoint} />
                    <Text style={styles.historiqueDate}>{p.date}</Text>
                    <Text style={styles.historiqueVal}>{p.valeur} kg</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* Onglet Aujourd'hui */}
        {ongletActif === 'journee' && (
          <>
            <View style={styles.carteHero}>
              <View style={styles.glowVert} />
              <Text style={styles.heroBadge}>BILAN DU JOUR</Text>

              {[
                { label: 'Calories', val: journee.caloriesConsommees, obj: objectifs.calories, unite: 'kcal', couleur: '#4CAF50' },
                { label: 'Proteines', val: journee.proteinesConsommees, obj: objectifs.proteines, unite: 'g', couleur: '#4CAF50' },
                { label: 'Glucides', val: journee.glucidesConsommes, obj: objectifs.glucides, unite: 'g', couleur: '#FF9800' },
                { label: 'Lipides', val: journee.lipidesConsommes, obj: objectifs.lipides, unite: 'g', couleur: '#2196F3' },
                { label: 'Hydratation', val: journee.eauConsommee, obj: objectifs.hydratation, unite: 'ml', couleur: '#2196F3' },
              ].map((o) => {
                const p = pct(o.val, o.obj);
                return (
                  <View key={o.label} style={styles.objectifItem}>
                    <View style={styles.objectifHeader}>
                      <Text style={styles.objectifLabel}>{o.label}</Text>
                      <View style={styles.objectifDroite}>
                        <Text style={styles.objectifVal}>{o.val}<Text style={styles.objectifUnite}>{o.unite}</Text></Text>
                        <Text style={[styles.objectifPct, { color: p >= 100 ? '#4CAF50' : o.couleur }]}>{p}%</Text>
                      </View>
                    </View>
                    <View style={styles.barreContainer}>
                      <View style={[styles.barre, { width: `${p}%`, backgroundColor: p >= 100 ? '#4CAF50' : o.couleur }]} />
                    </View>
                    <Text style={styles.objectifObj}>Objectif : {o.obj} {o.unite}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Onglet Stats */}
        {ongletActif === 'stats' && (
          <>
            <View style={styles.statsGrille}>
              {stats.map((s) => (
                <View key={s.label} style={styles.statCarte}>
                  <View style={[styles.statIcone, { backgroundColor: `${s.couleur}15` }]}>
                    <Ionicons name={s.icone} size={20} color={s.couleur} />
                  </View>
                  <Text style={styles.statVal}>{s.val}</Text>
                  {s.unite ? <Text style={styles.statUnite}>{s.unite}</Text> : null}
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.carte}>
              <Text style={styles.carteLabel}>Profil</Text>
              {[
                { label: 'Prénom', val: profil.nom },
                { label: 'Poids de depart', val: `${profil.poids} kg` },
                { label: 'Taille', val: `${profil.taille} cm` },
                { label: 'Age', val: `${profil.age} ans` },
                { label: 'Niveau', val: profil.niveau },
              ].map((p) => (
                <View key={p.label} style={styles.profilLigne}>
                  <Text style={styles.profilLabel}>{p.label}</Text>
                  <Text style={styles.profilVal}>{p.val}</Text>
                </View>
              ))}
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const graphique = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 16, marginBottom: 4, height: 160 },
  colonne: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  valeurFlottante: { fontSize: 11, fontWeight: '800', marginBottom: 4 },
  barreWrapper: { width: '100%', alignItems: 'center', justifyContent: 'flex-end', height: 120 },
  barre: { borderRadius: 8, minHeight: 8 },
  date: { fontSize: 9, color: '#444', marginTop: 6, textAlign: 'center' },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 16, paddingBottom: 100 },
  titre: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 16, marginTop: 8, letterSpacing: -0.5 },

  onglets: { flexDirection: 'row', backgroundColor: '#1a1a1a', borderRadius: 14, padding: 4, marginBottom: 16 },
  onglet: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  ongletActif: { backgroundColor: '#242424' },
  ongletTxt: { color: '#555', fontSize: 13, fontWeight: '600' },
  ongletTxtActif: { color: '#fff' },

  carteHero: {
    backgroundColor: 'rgba(26,26,26,0.8)', borderRadius: 24, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden',
  },
  glowVert: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#4CAF50', opacity: 0.07, top: -40, right: -30 },
  heroBadge: { fontSize: 11, color: '#4CAF50', letterSpacing: 1, fontWeight: '700', marginBottom: 16 },

  poidsResume: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  poidsItem: { alignItems: 'center' },
  poidsVal: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  poidsUnite: { fontSize: 14, color: '#555', marginTop: -4 },
  poidsLbl: { fontSize: 11, color: '#444', marginTop: 4 },
  poidsFleche: { alignItems: 'center', gap: 4 },
  difference: { fontSize: 16, fontWeight: '800' },

  graphiqueVide: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  graphiqueVideTxt: { color: '#444', fontSize: 13, textAlign: 'center' },

  carte: {
    backgroundColor: 'rgba(26,26,26,0.8)', borderRadius: 24, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  carteLabel: { fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 14 },

  inputLigne: { flexDirection: 'row', gap: 10 },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#242424', borderRadius: 12, paddingHorizontal: 14 },
  input: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 14 },
  inputUnite: { color: '#555', fontSize: 14 },
  boutonAjouter: { width: 50, height: 50, borderRadius: 14, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },

  historiqueLigne: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  historiquePoint: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50' },
  historiqueDate: { flex: 1, color: '#555', fontSize: 13 },
  historiqueVal: { color: '#fff', fontSize: 14, fontWeight: '700' },

  objectifItem: { marginBottom: 16 },
  objectifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  objectifLabel: { color: '#888', fontSize: 14 },
  objectifDroite: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  objectifVal: { color: '#fff', fontSize: 14, fontWeight: '700' },
  objectifUnite: { fontSize: 11, fontWeight: '400', color: '#666' },
  objectifPct: { fontSize: 13, fontWeight: '800' },
  barreContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 4 },
  barre: { height: 4, borderRadius: 2 },
  objectifObj: { color: '#333', fontSize: 11 },

  statsGrille: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  statCarte: {
    width: '47.5%', backgroundColor: 'rgba(26,26,26,0.8)', borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  statIcone: { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statVal: { fontSize: 22, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  statUnite: { fontSize: 11, color: '#555', marginTop: 2 },
  statLabel: { fontSize: 12, color: '#444', marginTop: 6 },

  profilLigne: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  profilLabel: { color: '#555', fontSize: 14 },
  profilVal: { color: '#fff', fontSize: 14, fontWeight: '600' },
});