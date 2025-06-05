import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import Colors from '../constants/Colors';

interface TextLinkProps {
  text: string;
  onPress: () => void;
  color?: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  underline?: boolean;
}

export default function TextLink({
  text,
  onPress,
  color = Colors.primary,
  style,
  containerStyle,
  underline = true,
}: TextLinkProps) {
  return (
    <TouchableOpacity style={containerStyle} onPress={onPress} activeOpacity={0.7}>
      <Text
        style={[
          styles.text,
          { color },
          underline && styles.underline,
          style,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: 'currentColor',
  },
});