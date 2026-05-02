import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MessageBox from '@/components/MessageBox/MessageBox';
import OrbiAvatar from '@/components/OrbiAvatar/OrbiAvatar';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import api from '@/services/api';

const POLL_INTERVAL_MS = 5000;

export default function WaitingTicket() {
  const { ticketId } = useLocalSearchParams<{ ticketId?: string }>();

  useEffect(() => {
    if (!ticketId) {
      return;
    }

    let isActive = true;

    const checkAssignment = async () => {
      try {
        const response = await api.get(`/tickets/${ticketId}`);
        const ticket = response.data;

        if (isActive && ticket?.agentId) {
          router.replace({
            pathname: '/chat',
            params: { ticketId },
          });
        }
      } catch (err) {
        console.error('Erro ao verificar atribuicao do ticket', err);
      }
    };

    checkAssignment();
    const intervalId = setInterval(checkAssignment, POLL_INTERVAL_MS);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [ticketId]);

  return (
    <View style={styles.container}>
      <OrbiAvatar variant="sleep" size={180} />
      <ActivityIndicator size="large" color={Colors.teal.base} style={styles.loader} />

      <MessageBox text="Aguarde um instante." />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.replace('/(user)/(tabs)')}
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
  loader: {
    marginTop: -8,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.orange.base,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: Colors.white[300],
    fontWeight: 'bold',
  },
});