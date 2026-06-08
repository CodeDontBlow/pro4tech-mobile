import Button from '@/components/Button/Button';
import OrbiAvatar from '@/components/OrbiAvatar/OrbiAvatar';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import api from '@/services/api';
import { router } from 'expo-router';
import Updates from 'expo-updates';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Welcome() {
  const insets = useSafeAreaInsets();

  console.log('API URL =', process.env.EXPO_PUBLIC_API_URL_ANDROID);
  console.log('BASE URL =', api.defaults.baseURL);
  console.log('Updates object', Updates);
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> 
      <OrbiAvatar variant="elipse" size={180} />

      <Text style={[globalStyles.subtitle, styles.welcome]}>Bem-vindo ao</Text>
      <Text style={[globalStyles.title2, styles.orbitaTitle]}>ORBITA</Text>

      <Text style={[globalStyles.text1, styles.description]}>
        O suporte da Pro4Tech que garante a continuidade das suas operações.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          label="Cadastre-se para Começar"
          onPress={() => router.push('/auth/company')}
          variant="light" />
        <Text style={[globalStyles.text2, styles.loginText]}>
          Já tem conta?{' '}
          <Text style={styles.link} onPress={() => router.push('/auth/login')}>
            Entrar
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.teal[700],
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    color: Colors.white[300],
    textAlign: 'center',
    marginBottom: 18,
  },
  title: {
    color: Colors.white[300],
    textAlign: 'center',
    letterSpacing: 4,
    fontWeight: 'bold',
  },
  orbitaTitle: {
    color: Colors.white.base,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 75,
    fontWeight: '900',
  },
  description: {
    color: Colors.white.base,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 80,
    fontSize: 18,
    fontWeight: '200',
    lineHeight: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginText: {
    color: Colors.white[300],
    textAlign: 'center',
    fontWeight: '100',
    opacity: 0.9,
  },
  link: {
    color: Colors.white[300],
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});