import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Colors from '../constants/Colors';

interface DividerProps {
  style?: ViewStyle;
  opacity?: number;
}

export default function Divider({ style, opacity = 0.3 }: DividerProps) {
  return <View style={[styles.divider, { opacity }, style]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: Colors.textLight,
    width: '100%',
    marginVertical: 16,
  },
});