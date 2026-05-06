import TicketCard, { TicketStatus } from '@/components/TicketCard/ticketcard';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { TicketResponse, ticketService } from '@/services/ticket';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

type Ticket = {
  id: string;
  agent: { name: string; avatar?: string };
  lastMessage: string;
  status: TicketStatus;
};

const getAgentName = (ticket: TicketResponse) =>
  ticket.agent?.user?.name ?? '';

const getAgentAvatar = (ticket: TicketResponse) =>
  ticket.agent?.user?.avatarUrl;

const toCardTicket = (ticket: TicketResponse): Ticket => ({
  id: ticket.id,
  agent: {
    name: getAgentName(ticket),
    avatar: getAgentAvatar(ticket),
  },
  lastMessage: 'Última mensagem',
  status: ticket.status,
});

export default function History() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setError(null);
    try {
      const response = await ticketService.list({ page: 1, limit: 20 });
      setTickets(response.data.map(toCardTicket));
    } catch (err) {
      setError('Erro ao carregar tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[globalStyles.title2, styles.title]}>
          Histórico de Chamados
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <Ionicons name="calendar-outline" size={20} color={Colors.teal[500]} />
        <Text style={styles.filterText}>05/05/2026</Text>
      </View>

<View style={styles.ticketsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.teal.base} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TicketCard
                ticket={item}
                onPress={(id) => router.push({ pathname: '/chat', params: { ticketId: id } })}
              />
            )}
            ListEmptyComponent={
              <Text style={[globalStyles.text2,styles.emptyText, styles.description]}>Nenhum chamado encontrado</Text>
            }
          />
        )}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[300],
  },
  titleContainer: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: Colors.teal.base,
    fontSize: 32,
    textAlign: 'center',
  },
  filterContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.teal[500],
    backgroundColor: Colors.white[300],
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-end',
  },

  ticketsContainer: {
    flex: 1,
    paddingHorizontal: 32,
  },

  filterText: {
    color: Colors.teal[700],
    fontSize: 14,
    fontFamily: globalStyles.text2.fontFamily,
  },
  errorText: {
    color: Colors.red.base,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: Colors.black.base,
  },  
  description: {
    textAlign: 'center',
    marginTop: 12,
    color: Colors.black.base,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
});