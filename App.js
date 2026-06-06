import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import ProfilScreen from './src/screens/ProfilScreen';
import useStore from './src/store/useStore';

export default function App() {
  const profilComplet = useStore((state) => state.profilComplet);
  const charger = useStore((state) => state.charger);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    charger().finally(() => setChargement(false));
  }, []);

  if (chargement) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (!profilComplet) {
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