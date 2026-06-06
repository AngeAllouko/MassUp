import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';

export default function DashboardScreen() {
  const profil = useStore((state) => state.profil);
  const objectifs = useStore((state) => state.objectifs);
  const journee = useStore((state) => state.journee);
  const ajouterEau = useStore((state) => state.ajouterEau);

  const pctCalories = Math.min(Math.round((journee.caloriesConsommees / objectifs.calories) * 100), 100);
  const pctEau = Math.min(Math.round((journee.eauConsommee / objectifs.hydratation) * 100), 100);

  const joursMap = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const jourActuel = joursMap[new Date().getDay()];

  const seances = [
    { jour: 'Lundi', muscles: 'Poitrine & Triceps' },
    { jour: 'Mardi', muscles: 'Dos & Biceps' },
    { jour: 'Jeudi', muscles: 'Jambes' },
    { jour: 'Vendredi', muscles: 'Epaules & Abdos' },
    { jour: 'Samedi', muscles: 'Full Body' },
  ];
  const prochaineSeance = seances.find((s) => s.jour === jourActuel) || seances[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color="#4CAF50" />
            </View>
            <View>
              <Text style={styles.bonjourTxt}>Bonjour</Text>
              <Text style={styles.nomTxt}>{profil.nom}</Text>
            </View>
          </View>
          <View style={styles.badgePoids}>
            <Text style={styles.badgePoidsText}>{profil.poids} kg</Text>
          </View>
        </View>

        {/* Carte hero calories */}
        <View style={styles.carteHero}>
          <View style={styles.glowVert} />
          <Text style={styles.heroBadge}>AUJOURD'HUI</Text>
          <Text style={styles.heroValeur}>{journee.caloriesConsommees}</Text>
          <Text style={styles.heroUnite}>kcal consommées</Text>
          <View style={styles.barreContainer}>
            <View style={[styles.barre, { width: `${pctCalories}%` }]} />
          </View>
          <View style={styles.heroFooter}>
            <Text style={styles.heroPct}>{pctCalories}% atteint</Text>
            <Text style={styles.heroObj}>/ {objectifs.calories} kcal</Text>
          </View>
        </View>

        {/* Macros */}
        <View style={styles.ligne}>
          {[
            { label: 'Proteines', val: journee.proteinesConsommees, obj: objectifs.proteines, unite: 'g', couleur: '#4CAF50' },
            { label: 'Glucides', val: journee.glucidesConsommes, obj: objectifs.glucides, unite: 'g', couleur: '#FF9800' },
            { label: 'Lipides', val: journee.lipidesConsommes, obj: objectifs.lipides, unite: 'g', couleur: '#2196F3' },
          ].map((m) => (
            <View key={m.label} style={styles.carteMacro}>
              <Text style={[styles.macroVal, { color: m.couleur }]}>{m.val}<Text style={styles.macroUnite}>{m.unite}</Text></Text>
              <Text style={styles.macroLabel}>{m.label}</Text>
              <View style={styles.macroBarreContainer}>
                <View style={[styles.macroBarre, {
                  width: `${Math.min(Math.round((m.val / m.obj) * 100), 100)}%`,
                  backgroundColor: m.couleur,
                }]} />
              </View>
              <Text style={styles.macroObj}>/{m.obj}{m.unite}</Text>
            </View>
          ))}
        </View>

        {/* Hydratation */}
        <View style={styles.carte}>
          <View style={styles.glowBleu} />
          <View style={styles.carteRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.carteLabel}>Hydratation</Text>
              <Text style={styles.carteValeur}>{journee.eauConsommee} <Text style={styles.carteUnite}>ml</Text></Text>
              <Text style={styles.carteObj}>/ {objectifs.hydratation} ml</Text>
            </View>
            <TouchableOpacity style={styles.boutonEau} onPress={() => ajouterEau(250)}>
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={styles.boutonEauTxt}>250 ml</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.barreContainer}>
            <View style={[styles.barre, { width: `${pctEau}%`, backgroundColor: '#2196F3' }]} />
          </View>
        </View>

        {/* Prochaine seance */}
        <View style={styles.carte}>
          <View style={styles.glowVert2} />
          <Text style={styles.carteLabel}>Prochaine seance</Text>
          <Text style={styles.seanceJour}>{prochaineSeance.jour}</Text>
          <Text style={styles.seanceMuscles}>{prochaineSeance.muscles}</Text>
          <View style={styles.seanceBadge}>
            <Text style={styles.seanceBadgeTxt}>Sans materiel</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 16, paddingBottom: 40 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 8 },
  avatarContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(76,175,80,0.1)',
    borderWidth: 1, borderColor: 'rgba(76,175,80,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  bonjourTxt: { fontSize: 12, color: '#555' },
  nomTxt: { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  badgePoids: {
    backgroundColor: 'rgba(76,175,80,0.1)',
    borderWidth: 1, borderColor: 'rgba(76,175,80,0.2)',
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
  },
  badgePoidsText: { color: '#4CAF50', fontWeight: '700', fontSize: 14 },

  carteHero: {
    backgroundColor: 'rgba(26,26,26,0.8)',
    borderRadius: 24, padding: 22, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  glowVert: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: '#4CAF50', opacity: 0.08, top: -50, right: -40,
  },
  glowVert2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#4CAF50', opacity: 0.07, top: -30, right: -30,
  },
  glowBleu: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#2196F3', opacity: 0.08, top: -30, right: -30,
  },
  heroBadge: { fontSize: 11, color: '#4CAF50', letterSpacing: 1, fontWeight: '700', marginBottom: 8 },
  heroValeur: { fontSize: 56, fontWeight: '900', color: '#fff', letterSpacing: -2, lineHeight: 60 },
  heroUnite: { fontSize: 13, color: '#555', marginBottom: 18, marginTop: 4 },
  barreContainer: { height: 4, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  barre: { height: 4, backgroundColor: '#4CAF50', borderRadius: 2 },
  heroFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  heroPct: { color: '#4CAF50', fontSize: 12, fontWeight: '700' },
  heroObj: { color: '#444', fontSize: 12 },

  ligne: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  carteMacro: {
    flex: 1,
    backgroundColor: 'rgba(26,26,26,0.8)',
    borderRadius: 20, padding: 14,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  macroVal: { fontSize: 18, fontWeight: '800' },
  macroUnite: { fontSize: 12, fontWeight: '400' },
  macroLabel: { fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2, marginBottom: 8 },
  macroBarreContainer: { height: 3, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' },
  macroBarre: { height: 3, borderRadius: 2 },
  macroObj: { fontSize: 10, color: '#444', marginTop: 4 },

  carte: {
    backgroundColor: 'rgba(26,26,26,0.8)',
    borderRadius: 24, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  carteRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  carteLabel: { fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  carteValeur: { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  carteUnite: { fontSize: 14, fontWeight: '400', color: '#555' },
  carteObj: { fontSize: 12, color: '#444', marginTop: 2 },

  boutonEau: {
    backgroundColor: 'rgba(33,150,243,0.15)',
    borderWidth: 1, borderColor: 'rgba(33,150,243,0.3)',
    borderRadius: 14, padding: 14, alignItems: 'center', gap: 4,
  },
  boutonEauTxt: { color: '#2196F3', fontSize: 11, fontWeight: '700' },

  seanceJour: { fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 4 },
  seanceMuscles: { fontSize: 14, color: '#555', marginTop: 4, marginBottom: 12 },
  seanceBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start',
  },
  seanceBadgeTxt: { color: '#555', fontSize: 12 },
});