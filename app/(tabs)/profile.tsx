import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Settings, MapPin, Link, Edit2, Camera } from 'lucide-react-native';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const editScale = useSharedValue(1);
  const avatarScale = useSharedValue(1);

  const handleEditPress = () => {
    editScale.value = withSequence(
      withSpring(0.9),
      withSpring(1.1),
      withSpring(1)
    );
    setIsEditing(!isEditing);
  };

  const handleAvatarPress = () => {
    avatarScale.value = withSequence(
      withSpring(0.9),
      withSpring(1.1),
      withSpring(1)
    );
  };

  const editButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: editScale.value }]
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: avatarScale.value }]
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <AnimatedTouchable 
            style={[styles.avatarContainer, avatarStyle]}
            onPress={handleAvatarPress}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
              style={styles.avatar}
            />
            <View style={styles.cameraButton}>
              <Camera size={16} color={Colors.background} />
            </View>
          </AnimatedTouchable>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>Sarah Anderson</Text>
            <Text style={styles.username}>@sarahanderson</Text>
          </View>

          <AnimatedTouchable
            style={[styles.editButton, editButtonStyle]}
            onPress={handleEditPress}
            activeOpacity={0.8}
          >
            <Edit2 size={20} color={isEditing ? Colors.background : Colors.primary} />
            <Text style={[
              styles.editButtonText,
              isEditing && styles.editButtonTextActive
            ]}>
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </Text>
          </AnimatedTouchable>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.bio}>
            Digital nomad 🌎 | Photography enthusiast 📸 | Coffee addict ☕️
          </Text>
          <View style={styles.locationContainer}>
            <MapPin size={16} color={Colors.textLight} />
            <Text style={styles.locationText}>San Francisco, CA</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1.2K</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>843</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.sectionTitle}>Social Links</Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity style={styles.socialLink}>
              <Link size={20} color={Colors.primary} />
              <Text style={styles.socialLinkText}>linkedin.com/sarahanderson</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialLink}>
              <Link size={20} color={Colors.primary} />
              <Text style={styles.socialLinkText}>instagram.com/sarahanderson</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.interestsContainer}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestTags}>
            {['Photography', 'Travel', 'Coffee', 'Art', 'Technology', 'Music'].map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Text style={styles.interestTagText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
    height: Platform.OS === 'ios' ? 100 : 80,
    position: 'relative',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.secondary,
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 60 : 24,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  nameContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.secondary,
  },
  username: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.textLight,
    marginTop: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
  },
  editButtonTextActive: {
    color: Colors.background,
  },
  bioContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  bio: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textLight,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 24,
    backgroundColor: Colors.background,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: Colors.secondary,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.textLight,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.textLight + '20',
  },
  socialContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.secondary,
    marginBottom: 12,
  },
  socialLinks: {
    gap: 12,
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 12,
    shadowColor: Colors.secondary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  socialLinkText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  interestsContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestTagText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary,
  },
});