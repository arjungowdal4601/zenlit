import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Colors from '../constants/Colors';

export default function CreateAccountLink() {
  const handleCreateAccount = () => {
    router.push('/create-account-step1a');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Don't have an account?</Text>
      <TouchableOpacity onPress={handleCreateAccount} activeOpacity={0.7}>
        <Text style={styles.link}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: Colors.text,
    marginRight: 4,
  },
  link: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});