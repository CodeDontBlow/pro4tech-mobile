import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import InputField from '@/components/Input/Input';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { authService } from '@/services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('E-mail ou senha incorretos.\nTente novamente');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setHasError(true);
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      await authService.login({ email, password });
      router.replace('/(user)/(tabs)');
    } catch (error: any) {
      setHasError(true);
      setErrorMessage(error.response?.data?.message || 'E-mail ou senha incorretos.\nTente novamente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logos/Orbi.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={[globalStyles.title2, styles.title]}>Entrar</Text>

      <InputField
        placeholder="E-mail"
        icon="mail-outline"
        value={email}
        onChangeText={(text) => { setEmail(text); setHasError(false); }}
      />
      <InputField
        placeholder="Senha"
        icon="lock-closed-outline"
        value={password}
        onChangeText={(text) => { setPassword(text); setHasError(false); }}
        secureTextEntry
        isError={hasError}
      />

      <Text style={[globalStyles.label2, styles.forgotPassword]}>Esqueci minha senha</Text>

      {hasError && (
        <Text style={[globalStyles.label1, styles.errorText]}>
          {errorMessage}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          label={isLoading ? 'Entrando...' : 'Entrar'}
          onPress={handleLogin}
          disabled={isLoading}
        />
      </View>

      <Text style={[globalStyles.text2, styles.linkText]}>
        Não tem uma conta?{' '}
        <Text style={styles.link} onPress={() => router.push('/cadastro')}>
          Cadastrar
        </Text>
      </Text>

      <Text style={[globalStyles.text2, styles.link]}>Preciso de ajuda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[300],
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    color: Colors.teal.base,
    textAlign: 'center',
    marginBottom: 32,
  },
  forgotPassword: {
    color: Colors.teal.base,
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.red.base,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 24,
  },
  linkText: {
    textAlign: 'center',
    color: Colors.black.base,
  },
  link: {
    color: Colors.teal.base,
    textAlign: 'center',
    paddingVertical: 10,
    textDecorationLine: 'underline',
    marginTop: 20,
  },
});