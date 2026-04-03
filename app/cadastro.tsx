import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import InputField from '@/components/Input/Input';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { authService } from '@/services/authService';

const TEMP_COMPANY_ID = '019d5477-dc02-7227-a8b2-c94c0f85e7b1'; // ID mockado para testes

export default function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setHasError(true);
      setErrorMessage('Preencha todos os campos.');
      return;
    }
    if (passwordMismatch) {
      setHasError(true);
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);
      await authService.register({
        name,
        email,
        password,
        companyId: TEMP_COMPANY_ID,
        role: 'CLIENT',
      });
      router.push('/login');
    } catch (error: any) {
      setHasError(true);
      setErrorMessage(error.response?.data?.message || 'Não foi possível criar a conta.');
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

      <Text style={[globalStyles.title2, styles.title]}>Cadastrar</Text>

      <InputField
        placeholder="Nome"
        icon="person-outline"
        value={name}
        onChangeText={(text) => { setName(text); setHasError(false); }}
        isError={hasError && !name}
      />
      <InputField
        placeholder="E-mail"
        icon="mail-outline"
        value={email}
        onChangeText={(text) => { setEmail(text); setHasError(false); }}
        isError={hasError && !email}
      />
      <InputField
        placeholder="Senha"
        icon="lock-closed-outline"
        value={password}
        onChangeText={(text) => { setPassword(text); setHasError(false); }}
        secureTextEntry
        isError={hasError && (!password || passwordMismatch)}
      />
      <InputField
        placeholder="Digite novamente sua senha"
        icon="lock-closed-outline"
        value={confirmPassword}
        onChangeText={(text) => { setConfirmPassword(text); setHasError(false); }}
        secureTextEntry
        isError={hasError && (passwordMismatch || !confirmPassword)}
      />

      {hasError && (
        <Text style={[globalStyles.label1, styles.errorText]}>
          {errorMessage}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button
          label={isLoading ? 'Criando conta...' : 'Criar conta'}
          onPress={handleRegister}
          disabled={isLoading}
        />
      </View>

      <Text style={[globalStyles.text2, styles.linkText]}>
        Já tem uma conta?{' '}
        <Text style={styles.link} onPress={() => router.push('/login')}>
          Entrar
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
    marginTop: 15,
  },
});