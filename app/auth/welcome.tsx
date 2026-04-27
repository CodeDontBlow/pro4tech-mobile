import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import OrbiAvatar from '@/components/OrbiAvatar/OrbiAvatar';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <OrbiAvatar variant="default" size={180} />

      <Text style={[globalStyles.title2, styles.welcome]}>Bem-vindo ao</Text>
      <Text style={[globalStyles.title2, styles.title]}>ORBITA</Text>

      <Text style={[globalStyles.text1, styles.description]}>
        O suporte da Pro4Tech que garante a continuidade das suas operações.
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          label="Cadastre-se para Começar"
          onPress={() => router.push('/auth/register')}
          variant="light"
        />
        <Text style={[globalStyles.text2, styles.loginText]}>
          Já tem conta?{' '}
          <Text style={styles.link} onPress={() => router.push('/auth/login')}>
            Entrar
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.teal[700],
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    color: Colors.white[300],
    textAlign: 'center',
  },
  title: {
    color: Colors.white[300],
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  description: {
    color: Colors.white[300],
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 48,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginText: {
    color: Colors.white[300],
    textAlign: 'center',
  },
  link: {
    color: Colors.white[300],
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});