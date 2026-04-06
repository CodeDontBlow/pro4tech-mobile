import Button from '@/components/Button/Button';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const handlePress = () => {
    router.push('/(user)/triage');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/logos/Orbi Sleep.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[globalStyles.title2, styles.title]}>
          Olá!
        </Text>
        <Text style={[globalStyles.title2, styles.subtitle]}>
          Tudo em órbita?
        </Text>
        <Text style={[globalStyles.text2, styles.description]}>
          Você não tem nenhum chamado em aberto no momento.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button label="+ Abrir Chamado" onPress={handlePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[300],
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 150,
    height: 150,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    textAlign: 'center',
    lineHeight: 42, 
    letterSpacing: 0.5,
    color: Colors.teal.base,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 4, 
    lineHeight: 42,
    letterSpacing: 0.5,
    color: Colors.teal.base,
  },
  description: {
    textAlign: 'center',
    marginTop: 12,
    color: Colors.black.base,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 24,
  },
});