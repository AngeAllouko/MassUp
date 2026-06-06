import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import useStore from '../store/useStore';

export default function ProfilScreen() {
  const setProfil = useStore((state) => state.setProfil);

  const [nom, setNom] = useState('');
  const [poids, setPoids] = useState('');
  const [taille, setTaille] = useState('');
  const [age, setAge] = useState('');
  const [niveau, setNiveau] = useState('debutant');

  const niveaux = [
    { label: 'Debutant', value: 'debutant' },
    { label: 'Intermediaire', value: 'intermediaire' },
    { label: 'Avance', value: 'avance' },
  ];

  const handleSauvegarder = () => {
    if (!nom || !poids || !taille || !age) {
      Alert.alert('Champs manquants', 'Remplis tous les champs pour continuer.');
      return;
    }
    setProfil({ nom, poids, taille, age, niveau });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.titre}>MassUp</Text>
          <Text style={styles.sousTitre}>Ton compagnon prise de masse</Text>
        </View>

        {/* Carte formulaire */}
        <View style={styles.carte}>
          <Text style={styles.carteTitre}>Crée ton profil</Text>

          <Text style={styles.label}>Prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex : Kofi"
            placeholderTextColor="#444"
            value={nom}
            onChangeText={setNom}
          />

          {/* Poids + Taille sur la même ligne */}
          <View style={styles.ligne}>
            <View style={styles.demi}>
              <Text style={styles.label}>Poids (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="72"
                placeholderTextColor="#444"
                value={poids}
                onChangeText={setPoids}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.demi}>
              <Text style={styles.label}>Taille (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="178"
                placeholderTextColor="#444"
                value={taille}
                onChangeText={setTaille}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="24"
            placeholderTextColor="#444"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Niveau d'activité</Text>
          <View style={styles.niveauxContainer}>
            {niveaux.map((n) => (
              <TouchableOpacity
                key={n.value}
                style={[styles.niveauBtn, niveau === n.value && styles.niveauBtnActif]}
                onPress={() => setNiveau(n.value)}
              >
                <Text style={[styles.niveauTxt, niveau === n.value && styles.niveauTxtActif]}>
                  {n.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Récapitulatif dynamique */}
        {poids && taille && age ? (
          <View style={styles.recap}>
            <Text style={styles.recapTitre}>Apercu de tes objectifs</Text>
            <View style={styles.recapLigne}>
              <Text style={styles.recapLabel}>Calories / jour</Text>
              <Text style={styles.recapValeur}>
                {Math.round(
                  (88.36 + 13.4 * parseFloat(poids) + 4.8 * parseFloat(taille) - 5.7 * parseFloat(age)) *
                  ({ debutant: 1.375, intermediaire: 1.55, avance: 1.725 }[niveau]) + 300
                )} kcal
              </Text>
            </View>
            <View style={styles.recapLigne}>
              <Text style={styles.recapLabel}>Proteines / jour</Text>
              <Text style={styles.recapValeur}>{Math.round(parseFloat(poids) * 2)} g</Text>
            </View>
            <View style={styles.recapLigne}>
              <Text style={styles.recapLabel}>Hydratation / jour</Text>
              <Text style={styles.recapValeur}>{Math.round(parseFloat(poids) * 35)} ml</Text>
            </View>
          </View>
        ) : null}

        <TouchableOpacity style={styles.bouton} onPress={handleSauvegarder}>
          <Text style={styles.boutonTxt}>Commencer</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  content: {
    padding: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 10,
  },
  titre: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  sousTitre: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  carte: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  carteTitre: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    marginTop: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#242424',
    borderRadius: 12,
    padding: 14,
    color: '#fff',
    fontSize: 16,
  },
  ligne: {
    flexDirection: 'row',
    gap: 12,
  },
  demi: {
    flex: 1,
  },
  niveauxContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  niveauBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#242424',
    alignItems: 'center',
  },
  niveauBtnActif: {
    backgroundColor: '#4CAF50',
  },
  niveauTxt: {
    color: '#555',
    fontSize: 12,
    fontWeight: '600',
  },
  niveauTxtActif: {
    color: '#fff',
  },
  recap: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  recapTitre: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 14,
  },
  recapLigne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#242424',
  },
  recapLabel: {
    color: '#666',
    fontSize: 14,
  },
  recapValeur: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '700',
  },
  bouton: {
    backgroundColor: '#4CAF50',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  boutonTxt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});