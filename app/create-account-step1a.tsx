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
import { calculatePasswordStrength, PasswordStrength } from '@/utils/password';

export default function CreateAccountStep1a() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');
  const [usernameError, setUsernameError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [confirmError, setConfirmError] = useState<string | undefined>(undefined);
  
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

  const validateUsername = (username: string) => {
    if (!username) {
      setUsernameError('Username is required');
      return false;
    }

    if (username.length < 4) {
      setUsernameError('Username must be at least 4 characters');
      return false;
    }

    if (!/^[a-z0-9_]+$/.test(username)) {
      setUsernameError('Use lowercase letters, numbers, or _');
      return false;
    }

    setUsernameError(undefined);
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setPasswordError('Password must include uppercase, lowercase, number, and special character');
      return false;
    }

    setPasswordError(undefined);
    return true;
  };

  const validateConfirmPassword = (confirm: string) => {
    if (!confirm) {
      setConfirmError('Please confirm your password');
      return false;
    }

    if (confirm !== password) {
      setConfirmError('Passwords do not match');
      return false;
    }

    setConfirmError(undefined);
    return true;
  };


  const getStrengthColor = (strength: PasswordStrength) => {
    switch (strength) {
      case 'weak': return Colors.accent;
      case 'fair': return '#FFA500';
      case 'good': return '#2EC4B6';
      case 'strong': return '#00A878';
      default: return Colors.textLight;
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordStrength(calculatePasswordStrength(text));
    if (confirmPassword) {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleNext = async () => {
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!isUsernameValid || !isPasswordValid || !isConfirmValid) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/create-account-step2');
    } catch (error) {
      setPasswordError('An error occurred. Please try again.');
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

  const isButtonEnabled = username.length > 0 && password.length > 0 && confirmPassword.length > 0;

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
          <Text style={styles.title}>Choose Username & Password</Text>
          <Text style={styles.stepIndicator}>Step 1 of 3</Text>
        </View>

        <Text style={styles.instructions}>
          Pick a username and password.
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            label="Username"
            placeholder="john_doe"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            error={usernameError}
            onBlur={() => validateUsername(username)}
          />

          <Text style={styles.hint}>
            Lowercase, ≥ 4 chars; letters, numbers, _
          </Text>

          <TextInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={handlePasswordChange}
            isPassword={true}
            error={passwordError}
            onBlur={() => validatePassword(password)}
            containerStyle={styles.passwordContainer}
          />

          <View style={styles.strengthContainer}>
            <View style={styles.strengthMeter}>
              {[1, 2, 3, 4].map((segment) => (
                <View
                  key={segment}
                  style={[
                    styles.strengthSegment,
                    {
                      backgroundColor:
                        segment <= ['weak', 'fair', 'good', 'strong'].indexOf(passwordStrength) + 1
                          ? getStrengthColor(passwordStrength)
                          : Colors.textLight + '40',
                    },
                  ]}
                />
              ))}
            </View>
            <Text style={[styles.strengthText, { color: getStrengthColor(passwordStrength) }]}>
              {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
            </Text>
          </View>

          <Text style={styles.hint}>
            8+ chars: 1 uppercase, 1 lowercase, 1 number, 1 special
          </Text>

          <TextInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword={true}
            error={confirmError}
            onBlur={() => validateConfirmPassword(confirmPassword)}
            containerStyle={styles.confirmContainer}
          />

          {confirmPassword && !confirmError && (
            <Text style={styles.matchText}>Passwords match</Text>
          )}

          <Button
            title="Next"
            onPress={handleNext}
            disabled={!isButtonEnabled}
            loading={loading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.footer}>
          <TermsFooter prefix="By setting your username & password, " />
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
  stepIndicator: {
    position: 'absolute',
    right: 0,
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text,
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
  hint: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 16,
  },
  passwordContainer: {
    marginTop: 16,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  strengthMeter: {
    flex: 1,
    flexDirection: 'row',
    height: 4,
    backgroundColor: Colors.textLight + '40',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  strengthSegment: {
    flex: 1,
    marginHorizontal: 1,
  },
  strengthText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    minWidth: 60,
  },
  confirmContainer: {
    marginTop: 16,
  },
  matchText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 24,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
});