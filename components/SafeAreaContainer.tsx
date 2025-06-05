import React, { ReactNode } from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

interface SafeAreaContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  avoidKeyboard?: boolean;
  style?: any;
}

export default function SafeAreaContainer({
  children,
  scrollable = true,
  avoidKeyboard = true,
  style,
}: SafeAreaContainerProps) {
  const Container = scrollable ? ScrollView : View;

  const content = (
    <Container
      style={[styles.scrollView, !scrollable && styles.container]}
      contentContainerStyle={scrollable && styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.innerContainer, style]}>{children}</View>
    </Container>
  );

  if (avoidKeyboard) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {content}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: Layout.padding.horizontal,
    paddingTop: Layout.padding.top,
  },
});