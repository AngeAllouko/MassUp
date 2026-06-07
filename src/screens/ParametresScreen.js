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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useStore from '../store/useStore';

import {
  planifierRappelsHydratation,
  planifierRappelSeance,
  planifierBilanJournalier,
  annulerNotifications,
} from '../services/notifications';
import { exporterBilanSemaine } from '../services/export';

export default function ParametresScreen({ onFermer }) {
  const profil = useStore((state) => state.profil);
  const journee = useStore((state) => state.journee);
  const objectifs = useStore((state) => state.objectifs);
  const setProfil = useStore((state) => state.setProfil);
  const resetJournee = useStore((state) => state.resetJournee);
  const notificationsActives = useStore((state) => state.notificationsActives);
  const setNotificationsActives = useStore((state) => state.setNotificationsActives);
  const repas = useStore((state) => state.repas);
  const historiquePoids = useStore((state) => state.historiquePoids);
  const [exportEnCours, setExportEnCours] = useState(false);
  const [nom, setNom] = useState(profil.nom);
  const [poids, setPoids] = useState(profil.poids);
  const [taille, setTaille] = useState(profil.taille);
  const [age, setAge] = useState(profil.age);
  const [niveau, setNiveau] = useState(profil.niveau);
  const [modifie, setModifie] = useState(false);

  const niveaux = [
    { label: 'Debutant', value: 'debutant' },
    { label: 'Intermediaire', value: 'intermediaire' },
    { label: 'Avance', value: 'avance' },
  ];

  const handleSauvegarder = () => {
    if (!nom || !poids || !taille || !age) {
      Alert.alert('Champs manquants', 'Remplis tous les champs.');
      return;
    }
    setProfil({ nom, poids, taille, age, niveau });
    setModifie(false);
    Alert.alert('Sauvegarde', 'Profil mis a jour avec succes.');
  };

  const handleReset = () => {
  Alert.alert(
    'Reset journee',
    'Remettre tous les compteurs du jour a zero ?',
    [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Confirmer', style: 'destructive', onPress: () => resetJournee() },
    ]
  );
};

const handleToggleNotification = async (cle, valeur) => {
  setNotificationsActives(cle, valeur);
  if (valeur) {
    if (cle === 'hydratation') await planifierRappelsHydratation();
    if (cle === 'seance') await planifierRappelSeance([1, 2, 4, 5, 6]);
    if (cle === 'bilan') await planifierBilanJournalier();
  } else {
    await annulerNotifications(cle);
  }
};

const handleExporter = async () => {
  setExportEnCours(true);
  try {
    await exporterBilanSemaine({ profil, objectifs, journee, repas, historiquePoids });
  } catch (e) {
    Alert.alert('Erreur détaillée', e.message || JSON.stringify(e));
  } finally {
    setExportEnCours(false);
  }
};

  const marquerModifie = (fn) => (...args) => {
    fn(...args);
    setModifie(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titre}>Parametres</Text>
          <TouchableOpacity style={styles.fermerBtn} onPress={onFermer}>
            <Ionicons name="close" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        {/* Profil */}
        <View style={styles.carte}>
          <View style={styles.glowVert} />
          <Text style={styles.carteLabel}>Mon profil</Text>

          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            value={nom}
            onChangeText={marquerModifie(setNom)}
            placeholderTextColor="#444"
          />

          <View style={styles.ligne}>
            <View style={styles.demi}>
              <Text style={styles.label}>Poids (kg)</Text>
              <TextInput
                style={styles.input}
                value={poids}
                onChangeText={marquerModifie(setPoids)}
                keyboardType="numeric"
                placeholderTextColor="#444"
              />
            </View>
            <View style={styles.demi}>
              <Text style={styles.label}>Taille (cm)</Text>
              <TextInput
                style={styles.input}
                value={taille}
                onChangeText={marquerModifie(setTaille)}
                keyboardType="numeric"
                placeholderTextColor="#444"
              />
            </View>
          </View>

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={marquerModifie(setAge)}
            keyboardType="numeric"
            placeholderTextColor="#444"
          />

          <Text style={styles.label}>Niveau d'activité</Text>
          <View style={styles.niveauxContainer}>
            {niveaux.map((n) => (
              <TouchableOpacity
                key={n.value}
                style={[styles.niveauBtn, niveau === n.value && styles.niveauBtnActif]}
                onPress={() => { setNiveau(n.value); setModifie(true); }}
              >
                <Text style={[styles.niveauTxt, niveau === n.value && styles.niveauTxtActif]}>
                  {n.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {modifie && (
            <TouchableOpacity style={styles.boutonSauvegarder} onPress={handleSauvegarder}>
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={styles.boutonSauvegarderTxt}>Sauvegarder</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Objectifs recalculés */}
        <View style={styles.carte}>
          <Text style={styles.carteLabel}>Objectifs actuels</Text>
          {[
            { label: 'Calories', val: objectifs.calories, unite: 'kcal/jour', couleur: '#4CAF50' },
            { label: 'Proteines', val: objectifs.proteines, unite: 'g/jour', couleur: '#4CAF50' },
            { label: 'Glucides', val: objectifs.glucides, unite: 'g/jour', couleur: '#FF9800' },
            { label: 'Lipides', val: objectifs.lipides, unite: 'g/jour', couleur: '#2196F3' },
            { label: 'Hydratation', val: objectifs.hydratation, unite: 'ml/jour', couleur: '#2196F3' },
          ].map((o) => (
            <View key={o.label} style={styles.objectifLigne}>
              <Text style={styles.objectifLabel}>{o.label}</Text>
              <Text style={[styles.objectifVal, { color: o.couleur }]}>{o.val} <Text style={styles.objectifUnite}>{o.unite}</Text></Text>
            </View>
          ))}
        </View>

        {/* Notifications */}
        <View style={styles.carte}>
          <Text style={styles.carteLabel}>Notifications</Text>
          {[
            { label: 'Rappels hydratation', desc: 'Toutes les 2h', cle: 'hydratation' },
            { label: 'Rappel séance', desc: 'Le jour de ta seance', cle: 'seance' },
            { label: 'Bilan journalier', desc: 'Chaque soir a 20h', cle: 'bilan' },
          ].map((n) => (
            <View key={n.cle} style={styles.notifLigne}>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifLabel}>{n.label}</Text>
                <Text style={styles.notifDesc}>{n.desc}</Text>
              </View>
              <Switch
                value={notificationsActives[n.cle] || false}
                onValueChange={(val) => handleToggleNotification(n.cle, val)}
                trackColor={{ false: '#242424', true: 'rgba(76,175,80,0.4)' }}
                thumbColor={notificationsActives[n.cle] ? '#4CAF50' : '#555'}
              />
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.carte}>
          <Text style={styles.carteLabel}>Actions</Text>
          <TouchableOpacity style={styles.actionLigne} onPress={handleReset}>
            <View style={styles.actionIcone}>
              <Ionicons name="refresh-outline" size={18} color="#FF9800" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.actionLabel}>Reset journée</Text>
              <Text style={styles.actionDesc}>Remettre les compteurs du jour a zero</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.separateur} />
            <TouchableOpacity style={styles.actionLigne} onPress={handleExporter} disabled={exportEnCours}>
            <View style={[styles.actionIcone, { backgroundColor: 'rgba(76,175,80,0.1)' }]}>
            <Ionicons name="share-outline" size={18} color="#4CAF50" />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.actionLabel}>{exportEnCours ? 'Export en cours...' : 'Exporter mon bilan'}</Text>
            <Text style={styles.actionDesc}>Partager un résumé de ta journée</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#333" />
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>MassUp v1.0.0</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 16, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 8 },
  titre: { fontSize: 26, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  fermerBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1a1a1a', justifyContent: 'center', alignItems: 'center' },

  carte: {
    backgroundColor: 'rgba(26,26,26,0.8)', borderRadius: 24, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', overflow: 'hidden',
  },
  glowVert: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: '#4CAF50', opacity: 0.07, top: -40, right: -30 },
  carteLabel: { fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 },

  label: { fontSize: 12, color: '#666', marginBottom: 6, marginTop: 14, textTransform: 'uppercase', letterSpacing: 0.4 },
  input: { backgroundColor: '#242424', borderRadius: 12, padding: 14, color: '#fff', fontSize: 16 },
  ligne: { flexDirection: 'row', gap: 12 },
  demi: { flex: 1 },

  niveauxContainer: { flexDirection: 'row', gap: 8, marginTop: 8 },
  niveauBtn: { flex: 1, padding: 11, borderRadius: 12, backgroundColor: '#242424', alignItems: 'center' },
  niveauBtnActif: { backgroundColor: '#4CAF50' },
  niveauTxt: { color: '#555', fontSize: 12, fontWeight: '600' },
  niveauTxtActif: { color: '#fff' },

  separateur: { height: 1, backgroundColor: 'rgba(255,255,255,0.04)', marginVertical: 8 },

  boutonSauvegarder: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#4CAF50', borderRadius: 14, padding: 14, marginTop: 20,
  },
  boutonSauvegarderTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },

  objectifLigne: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  objectifLabel: { color: '#666', fontSize: 14 },
  objectifVal: { fontSize: 14, fontWeight: '700' },
  objectifUnite: { fontSize: 11, fontWeight: '400', color: '#555' },

  notifLigne: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  notifLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  notifDesc: { color: '#555', fontSize: 12, marginTop: 2 },

  actionLigne: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  actionIcone: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,152,0,0.1)', justifyContent: 'center', alignItems: 'center' },
  actionLabel: { color: '#fff', fontSize: 14, fontWeight: '600' },
  actionDesc: { color: '#555', fontSize: 12, marginTop: 2 },

  version: { color: '#333', fontSize: 12, textAlign: 'center', marginTop: 8 },
});