import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import InputField from '@/components/Input/Input';
import Colors from '@/constants/colors';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleLogin = () => {
    // validação temporária — integrar com backend depois
    if (!email || !password) {
      setHasError(true);
      return;
    }
    setHasError(false);
    router.push('/(tabs)');
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

      <Text style={styles.title}>Entrar</Text>

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

      <Text style={styles.forgotPassword}>Esqueci minha senha</Text>

      {hasError && (
        <Text style={styles.errorText}>
          E-mail ou senha incorretos.{'\n'}Tente novamente
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button label="Entrar" onPress={handleLogin} />
      </View>

      <Text style={styles.linkText}>
        Não tem uma conta?{' '}
        <Text style={styles.link} onPress={() => router.push('/cadastro')}>
          Cadastrar
        </Text>
      </Text>

      <Text style={[styles.link, { marginTop: 8 }]}>Preciso de ajuda</Text>
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
    fontSize: 36,
    fontWeight: '500',
    color: Colors.teal.base,
    textAlign: 'center',
    marginBottom: 32,
  },
  forgotPassword: {
    color: Colors.teal.base,
    fontSize: 14,
    textAlign: 'right',
    marginTop: -8,
    marginBottom: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.red.base,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginTop: 24,
  },
  linkText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.black.base,
  },
  link: {
    color: Colors.teal.base,
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 8,
    textDecorationLine: 'underline',
  },
});