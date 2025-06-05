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

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export default function SetNewPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');
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

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (!password) return 'weak';
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score === 3) return 'fair';
    if (score === 4) return 'good';
    return 'strong';
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

  const handleResetPassword = async () => {
    const isPasswordValid = validatePassword(password);
    const isConfirmValid = validateConfirmPassword(confirmPassword);

    if (!isPasswordValid || !isConfirmValid) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.replace('/login');
    } catch (error) {
      setPasswordError('Failed to reset password. Please try again.');
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

  const isButtonEnabled = password.length > 0 && confirmPassword.length > 0 && !passwordError && !confirmError;

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
          <Text style={styles.title}>Set New Password</Text>
        </View>

        <Text style={styles.instructions}>
          Create a new password.
        </Text>

        <View style={styles.formContainer}>
          <TextInput
            label="New Password"
            placeholder="••••••••"
            value={password}
            onChangeText={handlePasswordChange}
            isPassword={true}
            error={passwordError}
            onBlur={() => validatePassword(password)}
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
            Min 8 chars: 1 uppercase, 1 lowercase, 1 digit, 1 special
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
            title="Reset Password"
            onPress={handleResetPassword}
            disabled={!isButtonEnabled}
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
  hint: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 16,
  },
  confirmContainer: {
    marginTop: 8,
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