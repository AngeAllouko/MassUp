import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';
import ProfilScreen from './src/screens/ProfilScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import useStore from './src/store/useStore';

export default function App() {
  const profilComplet = useStore((state) => state.profilComplet);
  const charger = useStore((state) => state.charger);
  const [chargement, setChargement] = useState(true);
  const [onboardingFait, setOnboardingFait] = useState(false);
  const [profilFait, setProfilFait] = useState(false);

  useEffect(() => {
    const init = async () => {
      const onboarding = await AsyncStorage.getItem('massup_onboarding');
      setOnboardingFait(onboarding === 'done');
      await charger();
      setChargement(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (profilComplet) setProfilFait(true);
  }, [profilComplet]);

  if (chargement) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!onboardingFait) {
    return (
      <OnboardingScreen onTermine={() => setOnboardingFait(true)} />
    );
  }

  if (!profilComplet && !profilFait) {
    return <ProfilScreen />;
  }

  return <AppNavigator />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    justifyContent: 'center',
    alignItems: 'center',
  },
});