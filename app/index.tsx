import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import Colors from '../constants/Colors';

export default function SplashScreen() {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.9);

  useEffect(() => {
    // Fade in animation
    opacity.value = withTiming(1, { 
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    
    scale.value = withTiming(1, { 
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });

    // Navigate to login screen after delay
    const timer = setTimeout(() => {
      navigateToLogin();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const navigateToLogin = () => {
    // Fade out animation before navigation
    opacity.value = withTiming(0, { 
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    }, () => {
      runOnJS(router.replace)('/login');
    });
    
    scale.value = withTiming(1.1, { 
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }]
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <Text style={styles.logo}>ZenLit</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 48,
    color: Colors.primary,
    textAlign: 'center',
  },
});