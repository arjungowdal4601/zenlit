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

interface SocialProfile {
  url: string;
  verified: boolean;
  error?: string;
}

export default function CreateAccountStep3() {
  const [linkedin, setLinkedin] = useState<SocialProfile>({ url: '', verified: false });
  const [instagram, setInstagram] = useState<SocialProfile>({ url: '', verified: false });
  const [loading, setLoading] = useState(false);
  const [verifyingLinkedin, setVerifyingLinkedin] = useState(false);
  const [verifyingInstagram, setVerifyingInstagram] = useState(false);
  
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

  const validateLinkedinUrl = (url: string) => {
    return url.startsWith('https://www.linkedin.com/in/') && url.length > 28;
  };

  const validateInstagramUrl = (url: string) => {
    return url.startsWith('https://www.instagram.com/') && url.length > 26;
  };

  const handleVerifyLinkedin = async () => {
    if (!linkedin.url || verifyingLinkedin) return;

    setVerifyingLinkedin(true);
    setLinkedin(prev => ({ ...prev, error: undefined }));

    try {
      if (!validateLinkedinUrl(linkedin.url)) {
        throw new Error('Invalid LinkedIn URL');
      }

      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLinkedin(prev => ({ ...prev, verified: true }));
    } catch (error) {
      setLinkedin(prev => ({
        ...prev,
        verified: false,
        error: error instanceof Error ? error.message : 'Invalid LinkedIn URL'
      }));
    } finally {
      setVerifyingLinkedin(false);
    }
  };

  const handleVerifyInstagram = async () => {
    if (!instagram.url || verifyingInstagram) return;

    setVerifyingInstagram(true);
    setInstagram(prev => ({ ...prev, error: undefined }));

    try {
      if (!validateInstagramUrl(instagram.url)) {
        throw new Error('Invalid Instagram URL');
      }

      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setInstagram(prev => ({ ...prev, verified: true }));
    } catch (error) {
      setInstagram(prev => ({
        ...prev,
        verified: false,
        error: error instanceof Error ? error.message : 'Invalid Instagram URL'
      }));
    } finally {
      setVerifyingInstagram(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error:', error);
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

  const isButtonEnabled = linkedin.verified || instagram.verified;

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
          <Text style={styles.title}>Connect Social Accounts</Text>
          <Text style={styles.stepIndicator}>Step 3 of 3</Text>
        </View>

        <Text style={styles.instructions}>
          Optional: Connect your LinkedIn & Instagram to find friends.
        </Text>

        <View style={styles.formContainer}>
          <View style={styles.socialSection}>
            <TextInput
              label="LinkedIn Profile URL"
              placeholder="https://www.linkedin.com/in/username"
              value={linkedin.url}
              onChangeText={(text) => setLinkedin({ url: text, verified: false })}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <Button
              title="Verify LinkedIn"
              onPress={handleVerifyLinkedin}
              disabled={!linkedin.url || verifyingLinkedin}
              loading={verifyingLinkedin}
              style={styles.verifyButton}
            />

            {linkedin.verified && (
              <Text style={styles.successText}>LinkedIn verified</Text>
            )}
            {linkedin.error && (
              <Text style={styles.errorText}>{linkedin.error}</Text>
            )}
          </View>

          <View style={[styles.socialSection, styles.sectionSpacing]}>
            <TextInput
              label="Instagram Profile URL"
              placeholder="https://www.instagram.com/username"
              value={instagram.url}
              onChangeText={(text) => setInstagram({ url: text, verified: false })}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <Button
              title="Verify Instagram"
              onPress={handleVerifyInstagram}
              disabled={!instagram.url || verifyingInstagram}
              loading={verifyingInstagram}
              style={styles.verifyButton}
            />

            {instagram.verified && (
              <Text style={styles.successText}>Instagram verified</Text>
            )}
            {instagram.error && (
              <Text style={styles.errorText}>{instagram.error}</Text>
            )}
          </View>

          <Button
            title="Complete Profile"
            onPress={handleComplete}
            disabled={!isButtonEnabled}
            loading={loading}
            style={styles.completeButton}
          />
        </View>

        <View style={styles.footer}>
          <TermsFooter prefix="By connecting social accounts, " />
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
    fontSize: 24,
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
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  socialSection: {
    width: '100%',
  },
  sectionSpacing: {
    marginTop: 24,
  },
  verifyButton: {
    width: 160,
    height: 40,
    marginTop: 8,
  },
  successText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.accent,
    marginTop: 4,
  },
  completeButton: {
    marginTop: 32,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
});