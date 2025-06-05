import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

interface TermsFooterProps {
  prefix?: string;
}

export default function TermsFooter({ prefix = 'By logging in, ' }: TermsFooterProps) {
  const handleTermsPress = () => {
    console.log('Open terms and conditions');
    // Implement opening terms
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {prefix}
        <Text>you agree to our </Text>
        <Text style={styles.link} onPress={handleTermsPress}>
          Terms & Conditions
        </Text>
        <Text>.</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Poppins-Light',
    fontSize: 12,
    color: Colors.textLight,
    textAlign: 'center',
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});