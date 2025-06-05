import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, Calendar } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
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

type Gender = 'male' | 'female' | 'other' | null;

export default function CreateAccountStep2() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<Gender>(null);
  const [bio, setBio] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Error states
  const [firstNameError, setFirstNameError] = useState<string | undefined>(undefined);
  const [lastNameError, setLastNameError] = useState<string | undefined>(undefined);
  const [dateError, setDateError] = useState<string | undefined>(undefined);
  const [genderError, setGenderError] = useState<string | undefined>(undefined);
  
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

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== 'granted') {
      console.warn('Permission to access gallery was denied');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const handleDateChange = (text: string) => {
    // Remove any non-numeric characters
    let formatted = text.replace(/\D/g, '');
    
    // Add slashes after month and day
    if (formatted.length >= 4) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2, 4) + '/' + formatted.slice(4);
    } else if (formatted.length >= 2) {
      formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
    }
    
    // Limit the total length to 10 characters (MM/DD/YYYY)
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }
    
    setDateOfBirth(formatted);
  };

  const validateFirstName = (name: string) => {
    if (!name) {
      setFirstNameError('First Name is required.');
      return false;
    }
    setFirstNameError(undefined);
    return true;
  };

  const validateLastName = (name: string) => {
    if (!name) {
      setLastNameError('Last Name is required.');
      return false;
    }
    setLastNameError(undefined);
    return true;
  };

  const validateDate = (date: string) => {
    if (!date) {
      setDateError('Date of Birth is required.');
      return false;
    }
    
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(date)) {
      setDateError('Please enter a valid date (MM/DD/YYYY).');
      return false;
    }

    const [month, day, year] = date.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 13); // 13 years ago

    if (inputDate > today) {
      setDateError('Date cannot be in the future.');
      return false;
    }

    if (inputDate > minDate) {
      setDateError('You must be at least 13 years old.');
      return false;
    }

    setDateError(undefined);
    return true;
  };

  const validateGender = () => {
    if (!gender) {
      setGenderError('Gender is required.');
      return false;
    }
    setGenderError(undefined);
    return true;
  };

  const handleInterestInput = (text: string) => {
    if (text.endsWith(' ') && currentTag.startsWith('#')) {
      const newTag = currentTag.trim();
      if (newTag.length > 1 && !interests.includes(newTag)) {
        setInterests([...interests, newTag]);
      }
      setCurrentTag('');
    } else {
      setCurrentTag(text);
    }
  };

  const removeInterest = (tag: string) => {
    setInterests(interests.filter(t => t !== tag));
  };

  const handleNext = async () => {
    const isFirstNameValid = validateFirstName(firstName);
    const isLastNameValid = validateLastName(lastName);
    const isDateValid = validateDate(dateOfBirth);
    const isGenderValid = validateGender();

    if (!isFirstNameValid || !isLastNameValid || !isDateValid || !isGenderValid) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/create-account-step3');
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

  const isButtonEnabled = firstName && lastName && dateOfBirth && gender;

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
          <Text style={styles.title}>Profile Details</Text>
          <Text style={styles.stepIndicator}>Step 2 of 3</Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Profile Photo (optional)</Text>
          <TouchableOpacity 
            style={[
              styles.photoContainer,
              profilePhoto ? styles.photoContainerActive : null
            ]} 
            onPress={pickImage}
          >
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.photo} />
            ) : (
              <Camera size={24} color={Colors.background} />
            )}
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <TextInput
              label="First Name *"
              placeholder="e.g., Arjun"
              value={firstName}
              onChangeText={setFirstName}
              error={firstNameError}
              onBlur={() => validateFirstName(firstName)}
            />

            <TextInput
              label="Last Name *"
              placeholder="e.g., Gowda"
              value={lastName}
              onChangeText={setLastName}
              error={lastNameError}
              onBlur={() => validateLastName(lastName)}
              containerStyle={styles.inputSpacing}
            />

            <TextInput
              label="Date of Birth *"
              placeholder="MM/DD/YYYY"
              value={dateOfBirth}
              onChangeText={handleDateChange}
              error={dateError}
              onBlur={() => validateDate(dateOfBirth)}
              keyboardType="number-pad"
              maxLength={10}
              containerStyle={styles.inputSpacing}
              rightIcon={<Calendar size={20} color={Colors.text} />}
            />

            <View style={[styles.inputSpacing, styles.genderContainer]}>
              <Text style={styles.label}>Gender *</Text>
              <View style={styles.genderOptions}>
                {(['male', 'female', 'other'] as const).map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.genderOption,
                      gender === option && styles.genderOptionSelected
                    ]}
                    onPress={() => {
                      setGender(option);
                      setGenderError(undefined);
                    }}
                  >
                    <Text
                      style={[
                        styles.genderText,
                        gender === option && styles.genderTextSelected
                      ]}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {genderError && <Text style={styles.errorText}>{genderError}</Text>}
            </View>

            <TextInput
              label="Bio (optional)"
              placeholder="Tell us about yourself…"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              style={styles.bioInput}
              containerStyle={styles.inputSpacing}
              textAlignVertical="top"
            />

            <View style={styles.inputSpacing}>
              <Text style={styles.label}>Interests (optional)</Text>
              <TextInput
                placeholder="Add interests (e.g., #music, #travel)"
                value={currentTag}
                onChangeText={handleInterestInput}
                containerStyle={styles.tagsInput}
              />
              {interests.length > 0 && (
                <View style={styles.tagsContainer}>
                  {interests.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.tag}
                      onPress={() => removeInterest(tag)}
                    >
                      <Text style={styles.tagText}>{tag}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <Button
              title="Next"
              onPress={handleNext}
              disabled={!isButtonEnabled}
              loading={loading}
              style={styles.nextButton}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TermsFooter prefix="By completing your profile, " />
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
  scrollView: {
    flex: 1,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.textLight,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: Colors.textLight,
  },
  photoContainerActive: {
    borderColor: Colors.primary,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  formContainer: {
    width: '100%',
  },
  inputSpacing: {
    marginTop: 16,
  },
  genderContainer: {
    width: '100%',
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  genderOption: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.textLight,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  genderOptionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  genderText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text,
  },
  genderTextSelected: {
    color: Colors.background,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.accent,
    marginTop: 4,
  },
  bioInput: {
    height: 120,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  tagsInput: {
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#A8DADC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.secondary,
  },
  nextButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  footer: {
    marginBottom: 16,
  },
});