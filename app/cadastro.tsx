import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from '@/components/Button/Button';
import InputField from '@/components/Input/Input';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';

export default function Cadastro() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

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
        onChangeText={setName}
      />
      <InputField
        placeholder="E-mail"
        icon="mail-outline"
        value={email}
        onChangeText={setEmail}
      />
      <InputField
        placeholder="Senha"
        icon="lock-closed-outline"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <InputField
        placeholder="Digite novamente sua senha"
        icon="lock-closed-outline"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        isError={passwordMismatch}
      />

      {passwordMismatch && (
        <Text style={[globalStyles.label1, styles.errorText]}>As senhas não coincidem</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button label="Criar conta" onPress={() => {}} />
      </View>

      <Text style={[globalStyles.text2, styles.linkText]}>
        Já tem uma conta?{' '}
        <Text style={styles.link} onPress={() => router.push('/')}>
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
    marginTop: 15
  },
});