import Button from '@/components/Button/Button';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function TriageIntro() {
  const handleProceed = () => {
    router.push('/triage');
  };

  const handleCancel = () => {
    router.back(); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/logos/Orbi Sleep.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.messageBox}>
        <Text style={[globalStyles.text2, styles.description]}>
          Antes de te encaminhar para um de nossos atendentes, vamos fazer uma breve triagem para entender melhor como podemos te ajudar!
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          label="Clique para prosseguir" 
          onPress={handleProceed} 
        />
        
        <TouchableOpacity 
          onPress={handleCancel} 
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>Cancelar Chamado</Text>
        </TouchableOpacity>
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
  messageBox: {
    backgroundColor: Colors.white[500], 
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.teal.base, 
  },
  description: {
    textAlign: 'center',
    color: Colors.black.base,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: 12, 
  },
  cancelButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#E06D2B', 
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: Colors.white[300],
    fontWeight: 'bold',
    fontSize: 16,
  },
});