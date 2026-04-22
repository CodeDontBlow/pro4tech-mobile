import Button from '@/components/Button/Button';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function WaitingTicket() {
  const handleCancel = () => {
    router.replace('/(user)/(tabs)'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/logos/Orbi Sleep.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <ActivityIndicator 
          size="large" 
          color={Colors.teal.base} 
          style={{ marginTop: 20 }} 
        />
      </View>

      <View style={styles.messageBox}>
        <Text style={[globalStyles.text2, styles.description]}>
          Aguarde um instante.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
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
    width: 180, 
    height: 180,
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
    lineHeight: 24,
    fontSize: 18,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#E06D2B', 
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.white[300],
    fontWeight: 'bold',
    fontSize: 16,
  },
});