import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import DashboardScreen from '../screens/DashboardScreen';
import AlimentationScreen from '../screens/AlimentationScreen';
import EntrainementScreen from '../screens/EntrainementScreen';
import HydratationScreen from '../screens/HydratationScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ParametresScreen from '../screens/ParametresScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const ICONES = {
  Accueil: { active: 'home', inactive: 'home-outline' },
  Alimentation: { active: 'restaurant', inactive: 'restaurant-outline' },
  Entrainement: { active: 'barbell', inactive: 'barbell-outline' },
  Hydratation: { active: 'water', inactive: 'water-outline' },
  Progres: { active: 'pie-chart', inactive: 'pie-chart-outline' },
};

function TabItem({ route, estActif, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opaciteAnim = useRef(new Animated.Value(estActif ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(opaciteAnim, {
      toValue: estActif ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [estActif]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.82,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
    onPress();
  };

  const icone = ICONES[route.name];

  return (
    <View style={styles.tabItem}>
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={[styles.iconeWrapper, { transform: [{ scale: scaleAnim }] }]}>
          <Animated.View style={[styles.iconeActifFond, { opacity: opaciteAnim }]} />
          <Ionicons
            name={estActif ? icone.active : icone.inactive}
            size={22}
            color={estActif ? '#4CAF50' : 'rgba(255,255,255,0.3)'}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

function TabBarPersonnalisee({ state, descriptors, navigation }) {
  return (
    <View style={styles.conteneurFlottant}>
      <View style={styles.refletHaut} />
      <BlurView intensity={60} tint="dark" style={styles.blur}>
        <View style={styles.teinte}>
          <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
              const estActif = state.index === index;
              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!estActif && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };
              return (
                <TabItem key={route.key} route={route} index={index} estActif={estActif} onPress={onPress} />
              );
            })}
          </View>
        </View>
      </BlurView>
    </View>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBarPersonnalisee {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Accueil" component={DashboardScreen} />
      <Tab.Screen name="Alimentation" component={AlimentationScreen} />
      <Tab.Screen name="Entrainement" component={EntrainementScreen} />
      <Tab.Screen name="Hydratation" component={HydratationScreen} />
      <Tab.Screen name="Progres" component={ProgressScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="Parametres"
          component={({ navigation }) => (
            <ParametresScreen onFermer={() => navigation.goBack()} />
          )}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  conteneurFlottant: {
    position: 'absolute',
    bottom: 30, left: 20, right: 20,
    borderRadius: 30, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 24,
  },
  refletHaut: {
    position: 'absolute', top: 0, left: 20, right: 20, height: 1,
  },
  blur: { borderRadius: 30, overflow: 'hidden' },
  teinte: { backgroundColor: 'rgba(15,15,15,0.45)' },
  tabBar: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 8 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconeWrapper: { width: 46, height: 46, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  iconeActifFond: {
    position: 'absolute', width: 46, height: 46, borderRadius: 16,
    backgroundColor: 'rgba(76,175,80,0.12)',
    borderWidth: 1, borderColor: 'rgba(76,175,80,0.25)',
  },
});