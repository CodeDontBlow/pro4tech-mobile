import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { ticketService, TicketResponse } from '@/services/ticket';

export default function AgentHome() {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const response = await ticketService.list({ limit: 20 });
      setTickets(response.data);
    } finally {
      setLoading(false);
    }
  }

  async function assumeTicket(ticketId: string) {
    try {
      await ticketService.assignToMe(ticketId);
      await loadTickets();
      router.push({
        pathname: '/(agent)/chat',
        params: { ticketId },
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.teal.base} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={[globalStyles.title2, styles.title]}>Fila de Tickets</Text>

      <Text style={[globalStyles.text2, styles.subtitle]}>
        Clique em um chamado aberto para assumir atendimento.
      </Text>

      {tickets.map((ticket) => (
        <View key={ticket.id} style={styles.card}>
          <Text style={[globalStyles.subtitle2, styles.subject]}>
            #{ticket.ticketNumber} {ticket.subject?.name}
          </Text>

          <Text style={[globalStyles.text2, styles.company]}>
            Empresa: {ticket.company?.name}
          </Text>

          <Text style={[globalStyles.label1, styles.date]}>
            {new Date(ticket.createdAt).toLocaleString()}
          </Text>

          <View style={styles.bottom}>
            {!ticket.agentId ? (
              <TouchableOpacity
                style={styles.button}
                onPress={() => assumeTicket(ticket.id)}
              >
                <Text style={styles.buttonText}>Atribuir</Text>
              </TouchableOpacity>
            ) : (
              <Text style={[globalStyles.text2, styles.agentName]}>
                {ticket.agent?.user?.name}
              </Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white.base,
    padding: 20,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Colors.teal.base,
  },
  subtitle: {
    marginBottom: 24,
    color: Colors.black.base,
  },
  card: {
    backgroundColor: Colors.white[300],
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
  },
  subject: {
    color: Colors.teal.base,
    marginBottom: 12,
  },
  company: {
    marginBottom: 10,
    color: Colors.black.base,
  },
  date: {
    marginTop: 4,
    color: Colors.black[500],
  },
  bottom: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: Colors.green.base,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.white.base,
    fontWeight: '600',
  },
  agentName: {
    color: Colors.green.base,
    fontWeight: '700',
  },
});