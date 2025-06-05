import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Colors from '../constants/Colors';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import TermsFooter from '../components/TermsFooter';
import SafeAreaContainer from '../components/SafeAreaContainer';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    
    translateY.value = withTiming(0, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
  }, []);

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    setEmailError(undefined);
    return true;
  };

  const handleSendResetLink = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll simulate success and navigate to OTP screen
      router.push({
        pathname: '/otp-verification',
        params: { email }
      });
    } catch (error) {
      setEmailError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  return (
    <SafeAreaContainer>
      <Animated.View style={[styles.container, animatedStyle]}>
        <View style={styles.header}>
          <Button
            variant="outline"
            onPress={() => router.back()}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          >
            <ArrowLeft size={24} color={Colors.secondary} />
          </Button>
          <Text style={styles.title}>Reset Password</Text>
        </View>

        <Text style={styles.instructions}>
          Enter your email. We'll send a 6-digit code to reset your password.
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            error={emailError}
            onBlur={() => validateEmail(email)}
          />

          <Button
            title="Send Code"
            onPress={handleSendResetLink}
            disabled={!email}
            loading={loading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <TermsFooter prefix="By resetting your password, " />
        </View>
      </Animated.View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    height: 40,
    width: 40,
  },
  backButtonText: {
    color: Colors.secondary,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: Colors.secondary,
    textAlign: 'center',
  },
  instructions: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 16,
  },
  formContainer: {
    width: '100%',
  },
  submitButton: {
    marginTop: 16,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
});