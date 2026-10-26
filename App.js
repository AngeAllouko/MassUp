import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import ProfileScreen from './src/screens/ProfileScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { Glow } from './src/components/ui';
import { syncNotifications } from './src/services/notifications';
import useStore from './src/store/useStore';
import { colors } from './src/theme';

SplashScreen.preventAutoHideAsync();

function AnimatedSplash({ onDone }) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(20)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, speed: 8, bounciness: 12, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(textY, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(bar, { toValue: 1, duration: 900, useNativeDriver: false }),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
    ]).start(() => onDone());
  }, []);

  return (
    <View style={splash.container}>
      <Glow size={520} opacity={0.3} style={{ top: -140, alignSelf: 'center' }} />
      <Animated.View style={[splash.logoWrap, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        <View style={splash.logo}>
          <Glow size={140} opacity={0.35} style={{ top: -20, left: -20 }} />
          <Text style={splash.logoTxt}>M</Text>
        </View>
      </Animated.View>

      <Animated.View style={{ alignItems: 'center', opacity: textOpacity, transform: [{ translateY: textY }] }}>
        <Text style={splash.title}>MassUp</Text>
        <Text style={splash.sub}>Your bulking companion</Text>
      </Animated.View>

      <Animated.View style={[splash.barWrap, { opacity: textOpacity }]}>
        <View style={splash.barTrack}>
          <Animated.View
            style={[splash.bar, { width: bar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
          />
        </View>
      </Animated.View>
    </View>
  );
}

export default function App() {
  const profileComplete = useStore((s) => s.profileComplete);
  const load = useStore((s) => s.load);
  const [loading, setLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setOnboarded((await AsyncStorage.getItem('massup_onboarding')) === 'done');
        await load();
        // Clears reminders from older versions and re-creates the enabled ones in English.
        await syncNotifications(useStore.getState().notificationsEnabled).catch(() => {});
      } catch (e) {
        console.error(e);
      } finally {
        await SplashScreen.hideAsync();
        setLoading(false);
      }
    })();
  }, []);

  let content;
  if (!splashDone) {
    content = <AnimatedSplash onDone={() => setSplashDone(true)} />;
  } else if (loading) {
    content = <View style={splash.container} />;
  } else if (!onboarded) {
    content = <OnboardingScreen onDone={() => setOnboarded(true)} />;
  } else if (!profileComplete) {
    content = <ProfileScreen />;
  } else {
    content = <AppNavigator />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {content}
    </SafeAreaProvider>
  );
}

const splash = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  logoWrap: { marginBottom: 32 },
  logo: {
    width: 104, height: 104, borderRadius: 52, overflow: 'hidden',
    backgroundColor: colors.tealSoft, borderWidth: 1, borderColor: colors.borderTeal,
    alignItems: 'center', justifyContent: 'center',
  },
  logoTxt: { fontSize: 54, fontWeight: '900', color: colors.teal, letterSpacing: -2 },
  title: { fontSize: 44, fontWeight: '900', color: colors.text, letterSpacing: -2, marginBottom: 6 },
  sub: { fontSize: 14, color: colors.textMuted },
  barWrap: { position: 'absolute', bottom: 90, width: 120 },
  barTrack: { height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' },
  bar: { height: 3, backgroundColor: colors.teal, borderRadius: 2 },
});
