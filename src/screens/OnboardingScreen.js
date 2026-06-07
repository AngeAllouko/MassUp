import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    icone: 'barbell-outline',
    couleur: '#4CAF50',
    titre: 'Bienvenue sur MassUp',
    description: 'Ton compagnon prise de masse conçu pour les sportifs africains. Simple, efficace, sans salle de sport.',
  },
  {
    id: 2,
    icone: 'restaurant-outline',
    couleur: '#FF9800',
    titre: 'Alimentation locale',
    description: 'Suis tes macros avec une base d\'aliments ivoiriens et africains. Attieké, garba, foutou — tout y est.',
  },
  {
    id: 3,
    icone: 'water-outline',
    couleur: '#2196F3',
    titre: 'Hydratation intelligente',
    description: 'Ton objectif d\'eau est calculé selon ton poids. Des rappels te gardent hydraté tout au long de la journée.',
  },
  {
    id: 4,
    icone: 'trending-up-outline',
    couleur: '#9C27B0',
    titre: 'Suis tes progrès',
    description: 'Graphique de poids, bilan journalier, objectifs atteints. Vois ta progression semaine après semaine.',
  },
  {
    id: 5,
    icone: 'person-outline',
    couleur: '#4CAF50',
    titre: 'Prêt à prendre de la masse ?',
    description: 'Crée ton profil en 30 secondes. Tes objectifs caloriques et tes macros sont calculés automatiquement.',
  },
];

export default function OnboardingScreen({ onTermine }) {
  const [slideActif, setSlideActif] = useState(0);
  const scrollRef = useRef(null);
  const animScale = useRef(new Animated.Value(1)).current;

  const allerSlide = (index) => {
    scrollRef.current?.scrollTo({ x: index * width, animated: true });
    setSlideActif(index);
  };

  const handleSuivant = () => {
    if (slideActif < SLIDES.length - 1) {
      allerSlide(slideActif + 1);
    }
  };

  const handleCommencer = async () => {
    Animated.sequence([
      Animated.timing(animScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(animScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(async () => {
      await AsyncStorage.setItem('massup_onboarding', 'done');
      onTermine();
    });
  };

  const estDernier = slideActif === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.safe}>

      {/* Bouton passer */}
      {!estDernier && (
        <TouchableOpacity style={styles.passerBtn} onPress={handleCommencer}>
          <Text style={styles.passerTxt}>Passer</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
      >
        {SLIDES.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>

            {/* Illustration */}
            <View style={styles.illustrationContainer}>
              <View style={[styles.cercleExterne, { borderColor: `${slide.couleur}20` }]} />
              <View style={[styles.cercleMoyen, { borderColor: `${slide.couleur}30` }]} />
              <View style={[styles.cercleInterne, { backgroundColor: `${slide.couleur}15`, borderColor: `${slide.couleur}25` }]}>
                <View style={[styles.glowCentre, { backgroundColor: slide.couleur }]} />
                <Ionicons name={slide.icone} size={64} color={slide.couleur} />
              </View>
            </View>

            {/* Texte */}
            <View style={styles.texteContainer}>
              <Text style={styles.slideTitre}>{slide.titre}</Text>
              <Text style={styles.slideDescription}>{slide.description}</Text>
            </View>

          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>

        {/* Points indicateurs */}
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity key={i} onPress={() => allerSlide(i)}>
              <View style={[
                styles.dot,
                slideActif === i && styles.dotActif,
                slideActif === i && { backgroundColor: SLIDES[i].couleur },
              ]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Bouton action */}
        {estDernier ? (
          <Animated.View style={{ transform: [{ scale: animScale }] }}>
            <TouchableOpacity style={styles.boutonCommencer} onPress={handleCommencer}>
              <Text style={styles.boutonCommencerTxt}>Créer mon profil</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <TouchableOpacity style={styles.boutonSuivant} onPress={handleSuivant}>
            <Text style={styles.boutonSuivantTxt}>Suivant</Text>
            <Ionicons name="arrow-forward" size={18} color="#4CAF50" />
          </TouchableOpacity>
        )}

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0d0d0d' },

  passerBtn: {
    position: 'absolute', top: 60, right: 24, zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8,
  },
  passerTxt: { color: '#555', fontSize: 13, fontWeight: '600' },

  scrollView: { flex: 1 },

  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  illustrationContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  cercleExterne: {
    position: 'absolute',
    width: 240, height: 240, borderRadius: 120,
    borderWidth: 1,
  },
  cercleMoyen: {
    position: 'absolute',
    width: 190, height: 190, borderRadius: 95,
    borderWidth: 1,
  },
  cercleInterne: {
    width: 140, height: 140, borderRadius: 70,
    borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  glowCentre: {
    position: 'absolute',
    width: 80, height: 80, borderRadius: 40,
    opacity: 0.15,
  },

  texteContainer: { alignItems: 'center' },
  slideTitre: {
    fontSize: 28, fontWeight: '900', color: '#fff',
    textAlign: 'center', letterSpacing: -0.5, marginBottom: 16,
  },
  slideDescription: {
    fontSize: 16, color: '#666', textAlign: 'center',
    lineHeight: 24,
  },

  footer: {
    paddingHorizontal: 24, paddingBottom: 40, paddingTop: 24,
    gap: 24,
  },

  dotsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2a2a2a' },
  dotActif: { width: 24, borderRadius: 3 },

  boutonSuivant: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(76,175,80,0.08)',
    borderWidth: 1, borderColor: 'rgba(76,175,80,0.2)',
    borderRadius: 16, padding: 18,
  },
  boutonSuivantTxt: { color: '#4CAF50', fontWeight: '800', fontSize: 16 },

  boutonCommencer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#4CAF50', borderRadius: 16, padding: 18,
  },
  boutonCommencerTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});