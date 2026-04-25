import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '@/components/Button/Button';
import MessageBox from '@/components/MessageBox/MessageBox';
import OrbiAvatar from '@/components/OrbiAvatar/OrbiAvatar';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';

export default function TriageIntro() {
  return (
    <View style={styles.container}>
      <OrbiAvatar variant="sleep" size={150} />

      <MessageBox text="Antes de te encaminhar para um de nossos atendentes, vamos fazer uma breve triagem para entender melhor como podemos te ajudar!" />

      <View style={styles.buttonContainer}>
        <Button
          label="Clique para prosseguir"
          onPress={() => router.push('/triage')}
        />
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.cancelButton}
        >
          <Text style={[globalStyles.text2, styles.cancelButtonText]}>
            Cancelar Chamado
          </Text>
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
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.orange.base,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: Colors.white[300],
    fontWeight: 'bold',
  },
});