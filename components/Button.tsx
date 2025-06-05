import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Colors from '../constants/Colors';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: 'primary' | 'secondary' | 'outline';
  children?: React.ReactNode;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
  textStyle,
  variant = 'primary',
  children,
}: ButtonProps) {
  // Get button styles based on variant and disabled state
  const getButtonStyle = () => {
    if (disabled) {
      return styles.buttonDisabled;
    }

    switch (variant) {
      case 'secondary':
        return styles.buttonSecondary;
      case 'outline':
        return styles.buttonOutline;
      case 'primary':
      default:
        return styles.button;
    }
  };

  // Get text styles based on variant and disabled state
  const getTextStyle = () => {
    if (disabled) {
      return styles.textDisabled;
    }

    switch (variant) {
      case 'secondary':
        return styles.textSecondary;
      case 'outline':
        return styles.textOutline;
      case 'primary':
      default:
        return styles.text;
    }
  };

  // Animation for press effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: disabled ? 0.7 : withTiming(1, { duration: 150 }),
      transform: [{ scale: disabled ? 1 : withTiming(1, { duration: 150 }) }],
    };
  });

  return (
    <AnimatedTouchable
      style={[styles.container, getButtonStyle(), style, animatedStyle]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary : Colors.background}
          size="small"
        />
      ) : children ? (
        children
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    backgroundColor: Colors.primary,
  },
  buttonSecondary: {
    backgroundColor: Colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  buttonDisabled: {
    backgroundColor: Colors.textLight,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.background,
    textAlign: 'center',
  },
  textSecondary: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.background,
    textAlign: 'center',
  },
  textOutline: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
  textDisabled: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
  },
});