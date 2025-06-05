import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  withSpring,
} from 'react-native-reanimated';
import Colors from '../constants/Colors';
import Button from '../components/Button';
import TermsFooter from '../components/TermsFooter';
import SafeAreaContainer from '../components/SafeAreaContainer';

const TIMER_DURATION = 45;
const OTP_LENGTH = 6;

export default function OTPVerificationScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<TextInput[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();
  
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const shake = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    
    translateY.value = withTiming(0, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setTimer(TIMER_DURATION);
    setCanResend(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    setError(undefined);

    // Auto-advance
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
      
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      startTimer();
    } catch (error) {
      console.error('Failed to resend code:', error);
    }
  };

  const handleVerify = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setError(undefined);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const code = otp.join('');
      
      // For demo purposes, we'll simulate success for specific code
      if (code === '123456') {
        router.push('/set-new-password');
      } else {
        setError('Invalid code. Please try again.');
        shake.value = withSequence(
          withSpring(10),
          withSpring(-10),
          withSpring(8),
          withSpring(-8),
          withSpring(0)
        );
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
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

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shake.value }]
    };
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isComplete = otp.every(digit => digit !== '');

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
          <Text style={styles.title}>Verify Code</Text>
        </View>

        <Text style={styles.instructions}>
          Enter the 6-digit code we sent to {email}.
        </Text>

        <Animated.View style={[styles.otpContainer, shakeStyle]}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                focusedIndex === index && styles.otpInputFocused,
                error && styles.otpInputError
              ]}
              value={digit}
              onChangeText={text => handleOtpChange(text.slice(-1), index)}
              onKeyPress={e => handleKeyPress(e, index)}
              onFocus={() => setFocusedIndex(index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </Animated.View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title="Verify"
          onPress={handleVerify}
          disabled={!isComplete}
          loading={loading}
          style={styles.verifyButton}
        />

        <TouchableOpacity
          onPress={handleResend}
          disabled={!canResend}
          style={styles.resendContainer}
        >
          <Text style={[
            styles.resendText,
            canResend && styles.resendTextActive
          ]}>
            {canResend ? 'Resend Code' : `Resend code in ${formatTime(timer)}`}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TermsFooter prefix="By verifying, " />
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.textLight,
    borderRadius: 8,
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: Colors.secondary,
    textAlign: 'center',
    backgroundColor: Colors.background,
  },
  otpInputFocused: {
    borderColor: Colors.primary,
  },
  otpInputError: {
    borderColor: Colors.accent,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.accent,
    textAlign: 'center',
    marginBottom: 12,
  },
  verifyButton: {
    marginTop: 8,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    color: Colors.textLight,
  },
  resendTextActive: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
});