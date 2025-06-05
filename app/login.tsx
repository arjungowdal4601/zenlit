import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Keyboard } from 'react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Colors from '../constants/Colors';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Divider from '../components/Divider';
import CreateAccountLink from '../components/CreateAccountLink';
import TermsFooter from '../components/TermsFooter';
import TextLink from '../components/TextLink';
import SafeAreaContainer from '../components/SafeAreaContainer';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    // Animation on mount
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

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    
    setPasswordError(undefined);
    return true;
  };

  const handleLogin = () => {
    Keyboard.dismiss();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        // Navigate to home screen or handle authentication
        console.log('Login successful');
      }, 1500);
    }
  };

  const handleForgotPassword = () => {
    router.push('/reset-password');
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });

  const isButtonEnabled = email.length > 0 && password.length > 0;

  return (
    <SafeAreaContainer>
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text style={styles.logo}>ZenLit</Text>
        
        <View style={styles.formContainer}>
          <TextInput
            label="Email or Username"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            error={emailError}
            onBlur={() => validateEmail(email)}
          />
          
          <TextInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
            error={passwordError}
            onBlur={() => validatePassword(password)}
            containerStyle={styles.passwordContainer}
          />
          
          <View style={styles.forgotPasswordContainer}>
            <TextLink
              text="Forgot Password?"
              onPress={handleForgotPassword}
              color={Colors.accent}
              style={styles.forgotPassword}
            />
          </View>
          
          <Button
            title="Log In"
            onPress={handleLogin}
            disabled={!isButtonEnabled}
            loading={loading}
            style={styles.loginButton}
          />
          
          <Divider />
          
          <CreateAccountLink />
        </View>
        
        <View style={styles.footer}>
          <TermsFooter />
        </View>
      </Animated.View>
    </SafeAreaContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  passwordContainer: {
    marginTop: 8,
  },
  forgotPasswordContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPassword: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  loginButton: {
    marginTop: 24,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
});