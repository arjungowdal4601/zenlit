import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, Switch, TouchableOpacity, Platform } from 'react-native';
import { MessageSquare, MapPin, Sparkles } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Colors from '../../constants/Colors';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const [isInvisible, setIsInvisible] = useState(false);
  const [hasUnreadNotifications] = useState(true);
  const fabScale = useSharedValue(1);
  const fabRotate = useSharedValue(0);
  const sparkleScale = useSharedValue(1);

  const handleFABPress = () => {
    fabScale.value = withSequence(
      withSpring(0.9),
      withSpring(1.1),
      withSpring(1)
    );
    fabRotate.value = withTiming(fabRotate.value + 360, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    sparkleScale.value = withSequence(
      withSpring(1.2),
      withSpring(0.8),
      withSpring(1)
    );
  };

  const fabStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: fabScale.value },
      { rotate: `${fabRotate.value}deg` }
    ]
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }]
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, hasUnreadNotifications && styles.avatarContainerNotification]}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
            style={styles.avatar}
          />
          {hasUnreadNotifications && <View style={styles.notificationDot} />}
        </View>
        
        <Text style={styles.title}>Home</Text>
        
        <TouchableOpacity style={styles.messageButton} activeOpacity={0.7}>
          <MessageSquare size={24} color={Colors.secondary} />
          <View style={styles.messageBadge}>
            <Text style={styles.messageBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.welcomeText}>
        Hey Sarah, ready to light up your circle?
      </Text>

      <View style={styles.invisibleContainer}>
        <Text style={styles.invisibleText}>Go Invisible</Text>
        <Switch
          value={isInvisible}
          onValueChange={setIsInvisible}
          trackColor={{ false: Colors.textLight, true: Colors.primary }}
          thumbColor={Platform.select({
            ios: Colors.background,
            android: isInvisible ? Colors.background : '#f4f3f4'
          })}
          ios_backgroundColor={Colors.textLight}
          style={Platform.select({
            ios: styles.switchIOS,
            android: styles.switchAndroid,
          })}
        />
      </View>

      <View style={styles.fabContainer}>
        <AnimatedTouchable
          style={[styles.fab, fabStyle]}
          onPress={handleFABPress}
          activeOpacity={0.8}
        >
          <View style={styles.fabIconContainer}>
            <MapPin size={24} color={Colors.background} style={styles.fabIcon} />
            <Animated.View style={[styles.sparklesContainer, sparkleStyle]}>
              <Sparkles size={20} color={Colors.background} />
            </Animated.View>
          </View>
        </AnimatedTouchable>
        <Text style={styles.fabLabel}>Discover</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarContainerNotification: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  notificationDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.secondary,
  },
  messageButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  messageBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  messageBadgeText: {
    color: Colors.background,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 4,
  },
  welcomeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 24,
    color: Colors.text,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 32,
  },
  invisibleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 32,
    backgroundColor: Colors.background,
    padding: 16,
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
  invisibleText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: Colors.text,
  },
  switchIOS: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  switchAndroid: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  fabContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fabIcon: {
    position: 'absolute',
  },
  sparklesContainer: {
    position: 'absolute',
    transform: [{ translateX: 12 }, { translateY: -12 }],
  },
  fabLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 8,
  },
});