import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import useStore from '../store/useStore';

const QUANTITES = [150, 250, 330, 500];

export default function HydratationScreen() {
  const objectifs = useStore((state) => state.objectifs);
  const journee = useStore((state) => state.journee);
  const ajouterEau = useStore((state) => state.ajouterEau);

  const eauConsommee = journee.eauConsommee;
  const objectifEau = objectifs.hydratation;
  const pourcentage = Math.min(Math.round((eauConsommee / objectifEau) * 100), 100);

  const verresTotal = Math.round(objectifEau / 250);
  const verresBus = Math.round(eauConsommee / 250);

  const restant = Math.max(objectifEau - eauConsommee, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.titre}>Hydratation</Text>

        {/* Carte principale */}
        <View style={styles.cartePrincipale}>
          <Text style={styles.carteLabel}>Aujourd'hui</Text>
          <Text style={styles.valeurPrincipale}>
            {eauConsommee}
            <Text style={styles.unite}> ml</Text>
          </Text>
          <Text style={styles.objectifTxt}>Objectif : {objectifEau} ml</Text>

          {/* Barre de progression */}
          <View style={styles.barreContainer}>
            <View style={[styles.barre, { width: `${pourcentage}%` }]} />
          </View>
          <Text style={styles.pourcentageTxt}>{pourcentage}% atteint</Text>

          {/* Grille de verres */}
          <View style={styles.verresGrille}>
            {Array.from({ length: verresTotal }).map((_, i) => (
              <View key={i} style={[styles.verre, i < verresBus && styles.verrePlein]}>
                <Text style={styles.verreTxt}>{i < verresBus ? 'v' : ''}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.restantTxt}>
            {restant > 0 ? `Il te reste ${restant} ml` : 'Objectif atteint !'}
          </Text>
        </View>

        {/* Boutons d'ajout rapide */}
        <View style={styles.carte}>
          <Text style={styles.carteLabel}>Ajouter rapidement</Text>
          <View style={styles.boutonsLigne}>
            {QUANTITES.map((q) => (
              <TouchableOpacity
                key={q}
                style={styles.boutonQuantite}
                onPress={() => ajouterEau(q)}
              >
                <Text style={styles.boutonQuantiteVal}>{q}</Text>
                <Text style={styles.boutonQuantiteUnite}>ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Conseils */}
        <View style={styles.carte}>
          <Text style={styles.carteLabel}>Conseils</Text>
          {[
            { titre: 'Au reveil', conseil: 'Bois 500ml des le matin pour activer ton metabolisme.' },
            { titre: 'Avant l\'entrainement', conseil: 'Hydrate-toi 30 min avant ta seance.' },
            { titre: 'Pendant l\'entrainement', conseil: 'Bois 150 a 250ml toutes les 20 min.' },
            { titre: 'Apres l\'entrainement', conseil: 'Compense la perte en sueur avec 500ml minimum.' },
          ].map((c, i) => (
            <View key={i} style={styles.conseilItem}>
              <View style={styles.conseilPoint} />
              <View style={{ flex: 1 }}>
                <Text style={styles.conseilTitre}>{c.titre}</Text>
                <Text style={styles.conseilTxt}>{c.conseil}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 16, paddingBottom: 40 },
  titre: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 16, marginTop: 8, letterSpacing: -0.5 },
  cartePrincipale: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 12 },
  carteLabel: { fontSize: 12, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  valeurPrincipale: { fontSize: 48, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  unite: { fontSize: 20, fontWeight: '400', color: '#555' },
  objectifTxt: { color: '#444', fontSize: 13, marginBottom: 16 },
  barreContainer: { height: 6, backgroundColor: '#242424', borderRadius: 3, overflow: 'hidden', marginBottom: 8 },
  barre: { height: 6, backgroundColor: '#2196F3', borderRadius: 3 },
  pourcentageTxt: { color: '#2196F3', fontSize: 13, fontWeight: '700', marginBottom: 20 },
  verresGrille: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  verre: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#242424',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verrePlein: { backgroundColor: '#2196F3' },
  verreTxt: { fontSize: 10, color: '#fff' },
  restantTxt: { color: '#555', fontSize: 13, textAlign: 'center' },
  carte: { backgroundColor: '#1a1a1a', borderRadius: 20, padding: 20, marginBottom: 12 },
  boutonsLigne: { flexDirection: 'row', gap: 10 },
  boutonQuantite: {
    flex: 1,
    backgroundColor: '#242424',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  boutonQuantiteVal: { color: '#fff', fontSize: 18, fontWeight: '800' },
  boutonQuantiteUnite: { color: '#555', fontSize: 12, marginTop: 2 },
  conseilItem: { flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#242424' },
  conseilPoint: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2196F3', marginTop: 5 },
  conseilTitre: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 2 },
  conseilTxt: { color: '#555', fontSize: 13, lineHeight: 18 },
});