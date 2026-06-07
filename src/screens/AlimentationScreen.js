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

const CATEGORIES = ['Tous', 'Locaux', 'Proteines', 'Cereales', 'Legumes', 'Fruits'];

const ALIMENTS = [
  // Locaux
  { nom: 'Attieke', calories: 148, proteines: 1.2, glucides: 34, lipides: 0.5, portion: 100, categorie: 'Locaux' },
  { nom: 'Foutou banane', calories: 160, proteines: 1.5, glucides: 38, lipides: 0.3, portion: 100, categorie: 'Locaux' },
  { nom: 'Foutou igname', calories: 155, proteines: 1.8, glucides: 36, lipides: 0.2, portion: 100, categorie: 'Locaux' },
  { nom: 'Sauce graine', calories: 210, proteines: 4, glucides: 8, lipides: 18, portion: 100, categorie: 'Locaux' },
  { nom: 'Kedjenou poulet', calories: 175, proteines: 22, glucides: 5, lipides: 8, portion: 100, categorie: 'Locaux' },
  { nom: 'Aloko', calories: 180, proteines: 1.2, glucides: 28, lipides: 7, portion: 100, categorie: 'Locaux' },
  { nom: 'Garba', calories: 290, proteines: 18, glucides: 38, lipides: 6, portion: 100, categorie: 'Locaux' },
  { nom: 'Riz sauce tomate', calories: 195, proteines: 5, glucides: 35, lipides: 4, portion: 100, categorie: 'Locaux' },
  { nom: 'Thieboudienne', calories: 220, proteines: 14, glucides: 28, lipides: 6, portion: 100, categorie: 'Locaux' },
  { nom: 'Mafe', calories: 240, proteines: 16, glucides: 12, lipides: 14, portion: 100, categorie: 'Locaux' },
  { nom: 'Soupe kandia', calories: 185, proteines: 10, glucides: 8, lipides: 12, portion: 100, categorie: 'Locaux' },
  { nom: 'Couscous mil', calories: 170, proteines: 5, glucides: 35, lipides: 1.5, portion: 100, categorie: 'Locaux' },
  { nom: 'Tchep au poisson', calories: 245, proteines: 18, glucides: 32, lipides: 6, portion: 100, categorie: 'Locaux' },
{ nom: 'Tchep à la viande', calories: 260, proteines: 20, glucides: 31, lipides: 7, portion: 100, categorie: 'Locaux' },
{ nom: 'Attieke 2 oeufs', calories: 310, proteines: 15, glucides: 36, lipides: 11, portion: 100, categorie: 'Locaux' },
{ nom: 'Attieke poisson braise', calories: 275, proteines: 22, glucides: 34, lipides: 7, portion: 100, categorie: 'Locaux' },
{ nom: 'Attieke poulet', calories: 290, proteines: 24, glucides: 34, lipides: 8, portion: 100, categorie: 'Locaux' },
{ nom: 'Riz gras', calories: 230, proteines: 8, glucides: 38, lipides: 6, portion: 100, categorie: 'Locaux' },
{ nom: 'Placali sauce graine', calories: 280, proteines: 6, glucides: 42, lipides: 11, portion: 100, categorie: 'Locaux' },
{ nom: 'Foutou sauce arachide', calories: 310, proteines: 10, glucides: 40, lipides: 13, portion: 100, categorie: 'Locaux' },
{ nom: 'Bangui (vin de palme)', calories: 70, proteines: 0.5, glucides: 17, lipides: 0, portion: 100, categorie: 'Locaux' },
{ nom: 'Bouillie de mil', calories: 95, proteines: 3, glucides: 19, lipides: 1.5, portion: 100, categorie: 'Locaux' },
{ nom: 'Alloco poulet', calories: 320, proteines: 22, glucides: 30, lipides: 12, portion: 100, categorie: 'Locaux' },
{ nom: 'Soupe de poisson', calories: 140, proteines: 18, glucides: 6, lipides: 5, portion: 100, categorie: 'Locaux' },
{ nom: 'Riz au gras mouton', calories: 275, proteines: 16, glucides: 32, lipides: 9, portion: 100, categorie: 'Locaux' },
{ nom: 'Djoumblé', calories: 165, proteines: 8, glucides: 12, lipides: 9, portion: 100, categorie: 'Locaux' },
{ nom: 'Sauce claire poisson', calories: 110, proteines: 14, glucides: 4, lipides: 4, portion: 100, categorie: 'Locaux' },

  // Proteines
  { nom: 'Poulet grille', calories: 165, proteines: 31, glucides: 0, lipides: 3.6, portion: 100, categorie: 'Proteines' },
  { nom: 'Poisson braise', calories: 150, proteines: 28, glucides: 0, lipides: 4, portion: 100, categorie: 'Proteines' },
  { nom: 'Thon en boite', calories: 132, proteines: 29, glucides: 0, lipides: 1, portion: 100, categorie: 'Proteines' },
  { nom: 'Oeuf entier', calories: 155, proteines: 13, glucides: 1.1, lipides: 11, portion: 100, categorie: 'Proteines' },
  { nom: 'Boeuf maigre', calories: 158, proteines: 26, glucides: 0, lipides: 5.5, portion: 100, categorie: 'Proteines' },
  { nom: 'Sardines', calories: 208, proteines: 25, glucides: 0, lipides: 11, portion: 100, categorie: 'Proteines' },
  { nom: 'Haricots rouges', calories: 127, proteines: 8.7, glucides: 22, lipides: 0.5, portion: 100, categorie: 'Proteines' },
  { nom: 'Lentilles', calories: 116, proteines: 9, glucides: 20, lipides: 0.4, portion: 100, categorie: 'Proteines' },
  { nom: 'Arachides', calories: 567, proteines: 26, glucides: 16, lipides: 49, portion: 100, categorie: 'Proteines' },

  // Cereales
  { nom: 'Riz blanc cuit', calories: 130, proteines: 2.7, glucides: 28, lipides: 0.3, portion: 100, categorie: 'Cereales' },
  { nom: 'Pain de mie', calories: 265, proteines: 9, glucides: 49, lipides: 3.2, portion: 100, categorie: 'Cereales' },
  { nom: 'Pates cuites', calories: 158, proteines: 5.8, glucides: 31, lipides: 0.9, portion: 100, categorie: 'Cereales' },
  { nom: 'Farine de mais', calories: 362, proteines: 7, glucides: 76, lipides: 3.5, portion: 100, categorie: 'Cereales' },
  { nom: 'Avoine', calories: 389, proteines: 17, glucides: 66, lipides: 7, portion: 100, categorie: 'Cereales' },

  // Legumes
  { nom: 'Igname bouillie', calories: 118, proteines: 1.5, glucides: 28, lipides: 0.1, portion: 100, categorie: 'Legumes' },
  { nom: 'Patate douce', calories: 86, proteines: 1.6, glucides: 20, lipides: 0.1, portion: 100, categorie: 'Legumes' },
  { nom: 'Gombo', calories: 33, proteines: 1.9, glucides: 7, lipides: 0.2, portion: 100, categorie: 'Legumes' },
  { nom: 'Aubergine africaine', calories: 25, proteines: 1, glucides: 6, lipides: 0.2, portion: 100, categorie: 'Legumes' },
  { nom: 'Tomate', calories: 18, proteines: 0.9, glucides: 3.9, lipides: 0.2, portion: 100, categorie: 'Legumes' },
  { nom: 'Oignon', calories: 40, proteines: 1.1, glucides: 9, lipides: 0.1, portion: 100, categorie: 'Legumes' },

  // Fruits
  { nom: 'Banane plantain', calories: 122, proteines: 1.3, glucides: 32, lipides: 0.4, portion: 100, categorie: 'Fruits' },
  { nom: 'Mangue', calories: 60, proteines: 0.8, glucides: 15, lipides: 0.4, portion: 100, categorie: 'Fruits' },
  { nom: 'Avocat', calories: 160, proteines: 2, glucides: 9, lipides: 15, portion: 100, categorie: 'Fruits' },
  { nom: 'Papaye', calories: 43, proteines: 0.5, glucides: 11, lipides: 0.3, portion: 100, categorie: 'Fruits' },
  { nom: 'Ananas', calories: 50, proteines: 0.5, glucides: 13, lipides: 0.1, portion: 100, categorie: 'Fruits' },
  { nom: 'Orange', calories: 47, proteines: 0.9, glucides: 12, lipides: 0.1, portion: 100, categorie: 'Fruits' },
  { nom: 'Coco (chair)', calories: 354, proteines: 3.3, glucides: 15, lipides: 33, portion: 100, categorie: 'Fruits' },
];

export default function AlimentationScreen() {
  const objectifs = useStore((state) => state.objectifs);
  const journee = useStore((state) => state.journee);
  const ajouterRepas = useStore((state) => state.ajouterRepas);
  const supprimerRepas = useStore((state) => state.supprimerRepas);
  const repas = useStore((state) => state.repas);

  const [recherche, setRecherche] = useState('');
  const [categorieActive, setCategorieActive] = useState('Tous');
  const [alimentSelectionne, setAlimentSelectionne] = useState(null);
  const [quantite, setQuantite] = useState('100');
  const [modeRecherche, setModeRecherche] = useState(false);

  const alimentsFiltres = ALIMENTS.filter((a) => {
    const matchCategorie = categorieActive === 'Tous' || a.categorie === categorieActive;
    const matchRecherche = a.nom.toLowerCase().includes(recherche.toLowerCase());
    return matchCategorie && matchRecherche;
  });

  const handleAjouter = () => {
    if (!alimentSelectionne) return;
    const ratio = parseFloat(quantite) / 100;
    ajouterRepas({
      nom: alimentSelectionne.nom,
      quantite: parseFloat(quantite),
      calories: Math.round(alimentSelectionne.calories * ratio),
      proteines: Math.round(alimentSelectionne.proteines * ratio * 10) / 10,
      glucides: Math.round(alimentSelectionne.glucides * ratio * 10) / 10,
      lipides: Math.round(alimentSelectionne.lipides * ratio * 10) / 10,
    });
    setAlimentSelectionne(null);
    setQuantite('100');
    setRecherche('');
    setModeRecherche(false);
  };

  const handleSupprimer = (index) => {
    Alert.alert('Supprimer', 'Retirer cet aliment du journal ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => supprimerRepas(index) },
    ]);
  };

  const pourcentage = (val, obj) => Math.min(Math.round((val / (obj || 1)) * 100), 100);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        <Text style={styles.titre}>Alimentation</Text>

        {/* Recap macros */}
        <View style={styles.carteHero}>
          <View style={styles.glowVert} />
          <Text style={styles.heroBadge}>AUJOURD'HUI</Text>
          <View style={styles.macrosLigne}>
            {[
              { label: 'Calories', val: journee.caloriesConsommees, obj: objectifs.calories, unite: 'kcal', couleur: '#4CAF50' },
              { label: 'Proteines', val: journee.proteinesConsommees, obj: objectifs.proteines, unite: 'g', couleur: '#4CAF50' },
              { label: 'Glucides', val: journee.glucidesConsommes, obj: objectifs.glucides, unite: 'g', couleur: '#FF9800' },
              { label: 'Lipides', val: journee.lipidesConsommes, obj: objectifs.lipides, unite: 'g', couleur: '#2196F3' },
            ].map((m) => (
              <View key={m.label} style={styles.macroItem}>
                <Text style={[styles.macroVal, { color: m.couleur }]}>{m.val}<Text style={styles.macroUnite}>{m.unite}</Text></Text>
                <Text style={styles.macroLbl}>{m.label}</Text>
                <View style={styles.barreContainer}>
                  <View style={[styles.barre, { width: `${pourcentage(m.val, m.obj)}%`, backgroundColor: m.couleur }]} />
                </View>
                <Text style={styles.macroObj}>/{m.obj}{m.unite}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bouton ajouter */}
        {!modeRecherche && (
          <TouchableOpacity style={styles.boutonAjouter} onPress={() => setModeRecherche(true)}>
            <Ionicons name="add-circle-outline" size={20} color="#4CAF50" />
            <Text style={styles.boutonAjouterTxt}>Ajouter un aliment</Text>
          </TouchableOpacity>
        )}

        {/* Mode recherche */}
        {modeRecherche && (
          <View style={styles.carte}>
            <View style={styles.rechercheHeader}>
              <Text style={styles.carteLabel}>Ajouter un aliment</Text>
              <TouchableOpacity onPress={() => {
                setModeRecherche(false);
                setAlimentSelectionne(null);
                setRecherche('');
              }}>
                <Ionicons name="close" size={20} color="#555" />
              </TouchableOpacity>
            </View>

            {/* Barre de recherche */}
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={16} color="#555" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un aliment..."
                placeholderTextColor="#444"
                value={recherche}
                onChangeText={(t) => {
                  setRecherche(t);
                  setAlimentSelectionne(null);
                }}
                autoFocus
              />
              {recherche.length > 0 && (
                <TouchableOpacity onPress={() => setRecherche('')}>
                  <Ionicons name="close-circle" size={16} color="#555" />
                </TouchableOpacity>
              )}
            </View>

            {/* Catégories */}
            {!alimentSelectionne && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll} contentContainerStyle={styles.categoriesContainer}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.categorieBtn, categorieActive === c && styles.categorieBtnActif]}
                    onPress={() => setCategorieActive(c)}
                  >
                    <Text style={[styles.categorieTxt, categorieActive === c && styles.categorieTxtActif]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Liste aliments */}
            {!alimentSelectionne && (
              <View style={styles.suggestions}>
                {alimentsFiltres.slice(0, 8).map((a) => (
                  <TouchableOpacity
                    key={a.nom}
                    style={styles.suggestion}
                    onPress={() => {
                      setAlimentSelectionne(a);
                      setRecherche(a.nom);
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.suggestionNom}>{a.nom}</Text>
                      <Text style={styles.suggestionDetail}>{a.calories} kcal · {a.proteines}g prot · pour 100g</Text>
                    </View>
                    <View style={styles.categoriePill}>
                      <Text style={styles.categoriePillTxt}>{a.categorie}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {alimentsFiltres.length === 0 && (
                  <Text style={styles.aucunResultat}>Aucun aliment trouvé</Text>
                )}
              </View>
            )}

            {/* Aliment sélectionné */}
            {alimentSelectionne && (
              <View style={styles.alimentDetail}>
                <View style={styles.alimentDetailHeader}>
                  <Text style={styles.alimentNom}>{alimentSelectionne.nom}</Text>
                  <TouchableOpacity onPress={() => { setAlimentSelectionne(null); setRecherche(''); }}>
                    <Text style={styles.changerTxt}>Changer</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.quantiteLigne}>
                  <Text style={styles.quantiteLabel}>Quantite (g)</Text>
                  <View style={styles.quantiteControle}>
                    <TouchableOpacity
                      style={styles.quantiteBtn}
                      onPress={() => setQuantite((q) => String(Math.max(10, parseFloat(q) - 10)))}
                    >
                      <Ionicons name="remove" size={16} color="#fff" />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.quantiteInput}
                      value={quantite}
                      onChangeText={setQuantite}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={styles.quantiteBtn}
                      onPress={() => setQuantite((q) => String(parseFloat(q) + 10))}
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.apercuMacros}>
                  {[
                    { l: 'Calories', v: Math.round(alimentSelectionne.calories * parseFloat(quantite || 0) / 100), u: 'kcal', c: '#4CAF50' },
                    { l: 'Proteines', v: Math.round(alimentSelectionne.proteines * parseFloat(quantite || 0) / 100 * 10) / 10, u: 'g', c: '#4CAF50' },
                    { l: 'Glucides', v: Math.round(alimentSelectionne.glucides * parseFloat(quantite || 0) / 100 * 10) / 10, u: 'g', c: '#FF9800' },
                    { l: 'Lipides', v: Math.round(alimentSelectionne.lipides * parseFloat(quantite || 0) / 100 * 10) / 10, u: 'g', c: '#2196F3' },
                  ].map((m) => (
                    <View key={m.l} style={styles.apercuItem}>
                      <Text style={[styles.apercuVal, { color: m.c }]}>{m.v}<Text style={styles.apercuUnite}>{m.u}</Text></Text>
                      <Text style={styles.apercuLbl}>{m.l}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity style={styles.boutonValider} onPress={handleAjouter}>
                  <Ionicons name="checkmark" size={18} color="#fff" />
                  <Text style={styles.boutonValiderTxt}>Ajouter au journal</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Journal du jour */}
        {repas.length > 0 && (
          <View style={styles.carte}>
            <Text style={styles.carteLabel}>Journal du jour · {repas.length} aliment{repas.length > 1 ? 's' : ''}</Text>
            {repas.map((r, i) => (
              <View key={i} style={styles.repasItem}>
                <View style={styles.repasGauche}>
                  <Text style={styles.repasNom}>{r.nom}</Text>
                  <Text style={styles.repasDetail}>{r.quantite}g · {r.proteines}g prot · {r.glucides}g gluc</Text>
                </View>
                <View style={styles.repasDroite}>
                  <Text style={styles.repasCalories}>{r.calories} kcal</Text>
                  <TouchableOpacity onPress={() => handleSupprimer(i)} style={styles.supprimerBtn}>
                    <Ionicons name="trash-outline" size={14} color="#555" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d0d' },
  content: { padding: 16, paddingBottom: 100 },
  titre: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 16, marginTop: 8, letterSpacing: -0.5 },

  carteHero: {
    backgroundColor: 'rgba(26,26,26,0.8)', borderRadius: 24, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', overflow: 'hidden',
  },
  glowVert: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#4CAF50', opacity: 0.07, top: -40, right: -30,
  },
  heroBadge: { fontSize: 11, color: '#4CAF50', letterSpacing: 1, fontWeight: '700', marginBottom: 14 },
  macrosLigne: { flexDirection: 'row', justifyContent: 'space-between' },
  macroItem: { alignItems: 'center', flex: 1 },
  macroVal: { fontSize: 16, fontWeight: '800' },
  macroUnite: { fontSize: 10, fontWeight: '400' },
  macroLbl: { fontSize: 10, color: '#555', marginTop: 2, marginBottom: 6 },
  macroObj: { fontSize: 10, color: '#444', marginTop: 3 },
  barreContainer: { height: 3, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', width: '100%' },
  barre: { height: 3, borderRadius: 2 },

  boutonAjouter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(76,175,80,0.08)', borderRadius: 16, padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(76,175,80,0.2)',
  },
  boutonAjouterTxt: { color: '#4CAF50', fontWeight: '700', fontSize: 15 },

  carte: {
    backgroundColor: 'rgba(26,26,26,0.8)', borderRadius: 24, padding: 20, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
  },
  rechercheHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  carteLabel: { fontSize: 11, color: '#555', textTransform: 'uppercase', letterSpacing: 0.5 },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#242424', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 12,
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },

  categoriesScroll: { marginBottom: 12 },
  categoriesContainer: { gap: 8 },
  categorieBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, backgroundColor: '#242424' },
  categorieBtnActif: { backgroundColor: '#4CAF50' },
  categorieTxt: { color: '#555', fontSize: 13, fontWeight: '600' },
  categorieTxtActif: { color: '#fff' },

  suggestions: { borderRadius: 12, overflow: 'hidden' },
  suggestion: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#1e1e1e', padding: 14, borderBottomWidth: 1, borderBottomColor: '#242424',
  },
  suggestionNom: { color: '#fff', fontSize: 14, fontWeight: '600' },
  suggestionDetail: { color: '#555', fontSize: 12, marginTop: 2 },
  categoriePill: { backgroundColor: '#242424', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  categoriePillTxt: { color: '#555', fontSize: 10 },
  aucunResultat: { color: '#555', fontSize: 14, textAlign: 'center', padding: 20 },

  alimentDetail: { marginTop: 4 },
  alimentDetailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  alimentNom: { color: '#fff', fontSize: 17, fontWeight: '700' },
  changerTxt: { color: '#555', fontSize: 13 },

  quantiteLigne: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  quantiteLabel: { color: '#666', fontSize: 14 },
  quantiteControle: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  quantiteBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#242424', justifyContent: 'center', alignItems: 'center' },
  quantiteInput: { backgroundColor: '#242424', borderRadius: 10, padding: 8, color: '#fff', fontSize: 16, width: 70, textAlign: 'center' },

  apercuMacros: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, backgroundColor: '#1e1e1e', borderRadius: 14, padding: 14 },
  apercuItem: { alignItems: 'center', flex: 1 },
  apercuVal: { fontSize: 16, fontWeight: '800' },
  apercuUnite: { fontSize: 10, fontWeight: '400' },
  apercuLbl: { color: '#555', fontSize: 11, marginTop: 3 },

  boutonValider: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#4CAF50', borderRadius: 14, padding: 15,
  },
  boutonValiderTxt: { color: '#fff', fontWeight: '800', fontSize: 15 },

  repasItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  repasGauche: { flex: 1 },
  repasNom: { color: '#fff', fontSize: 14, fontWeight: '600' },
  repasDetail: { color: '#555', fontSize: 12, marginTop: 2 },
  repasDroite: { alignItems: 'flex-end', gap: 6 },
  repasCalories: { color: '#4CAF50', fontSize: 14, fontWeight: '700' },
  supprimerBtn: { padding: 4 },
});