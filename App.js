import React, { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Animated, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import ProfilScreen from './src/screens/ProfilScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import useStore from './src/store/useStore';

SplashScreen.preventAutoHideAsync();

function SplashPersonnalise({ onTermine }) {
  const opacite = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const opaciteTexte = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const largeurBarre = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo apparait
      Animated.parallel([
        Animated.timing(opacite, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, speed: 8, bounciness: 12, useNativeDriver: true }),
      ]),
      // Texte apparait
      Animated.parallel([
        Animated.timing(opaciteTexte, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      // Barre se remplit
      Animated.timing(largeurBarre, { toValue: 1, duration: 900, useNativeDriver: false }),
      // Pause
      Animated.delay(300),
      // Tout disparait
      Animated.parallel([
        Animated.timing(opacite, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(opaciteTexte, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start(() => onTermine());
  }, []);

  return (
    <View style={splash.container}>
      <View style={splash.glowHaut} />
      <View style={splash.glowBas} />

      <Animated.View style={[splash.logoContainer, { opacity: opacite, transform: [{ scale }] }]}>
        <View style={splash.cerclePrincipal}>
          <View style={splash.glowCentre} />
          <Text style={splash.logoIcone}>M</Text>
        </View>
      </Animated.View>

      <Animated.View style={[splash.texteContainer, { opacity: opaciteTexte, transform: [{ translateY }] }]}>
        <Text style={splash.titre}>MassUp</Text>
        <Text style={splash.sousTitre}>Ton compagnon prise de masse</Text>
      </Animated.View>

      <Animated.View style={[splash.barreWrapper, { opacity: opaciteTexte }]}>
        <View style={splash.barreContainer}>
          <Animated.View style={[splash.barre, {
            width: largeurBarre.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }]} />
        </View>
      </Animated.View>
    </View>
  );
}

export default function App() {
  const profilComplet = useStore((state) => state.profilComplet);
  const charger = useStore((state) => state.charger);
  const [chargement, setChargement] = useState(true);
  const [splashTermine, setSplashTermine] = useState(false);
  const [onboardingFait, setOnboardingFait] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const onboarding = await AsyncStorage.getItem('massup_onboarding');
        setOnboardingFait(onboarding === 'done');
        await charger();
      } catch (e) {
        console.error(e);
      } finally {
        await SplashScreen.hideAsync();
        setChargement(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (profilComplet) {}
  }, [profilComplet]);

  // Toujours montrer le splash en premier
  if (!splashTermine) {
    return <SplashPersonnalise onTermine={() => setSplashTermine(true)} />;
  }

  if (chargement) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!onboardingFait) {
    return <OnboardingScreen onTermine={() => setOnboardingFait(true)} />;
  }

  if (!profilComplet) {
    return <ProfilScreen />;
  }

  return <AppNavigator />;
}

const splash = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#0d0d0d',
    alignItems: 'center', justifyContent: 'center',
  },
  glowHaut: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: '#4CAF50', opacity: 0.06, top: -80, right: -60,
  },
  glowBas: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: '#2196F3', opacity: 0.05, bottom: -40, left: -40,
  },
  logoContainer: { marginBottom: 32 },
  cerclePrincipal: {
    width: 100, height: 100, borderRadius: 30,
    backgroundColor: 'rgba(76,175,80,0.12)',
    borderWidth: 1, borderColor: 'rgba(76,175,80,0.3)',
    justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
  },
  glowCentre: {
    position: 'absolute', width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#4CAF50', opacity: 0.15,
  },
  logoIcone: { fontSize: 52, fontWeight: '900', color: '#4CAF50', letterSpacing: -2 },
  texteContainer: { alignItems: 'center', marginBottom: 48 },
  titre: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: -1, marginBottom: 6 },
  sousTitre: { fontSize: 14, color: '#555' },
  barreWrapper: { position: 'absolute', bottom: 80, width: 120 },
  barreContainer: { height: 3, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' },
  barre: { height: 3, width: '70%', backgroundColor: '#4CAF50', borderRadius: 2 },
});

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0d0d0d', justifyContent: 'center', alignItems: 'center' },
});