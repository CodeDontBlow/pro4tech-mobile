import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { authService } from '@/services/authService';
import { TicketResponse, ticketService } from '@/services/ticket';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TicketCardData = {
  id: string;
  companyName: string;
  ticketNumber: number;
  updatedAt: string;
};

export default function AgentTicketsScreen() {
  const [tickets, setTickets] = useState<TicketCardData[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketCardData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await authService.getName();

      const response = await ticketService.list({
        page: 1, limit: 20,
      });

      const assignedTickets = response.data
        .filter(ticket => ticket.agentId)
        .map((ticket: TicketResponse) => ({
          id: ticket.id,
          companyName: ticket.company?.name ?? 'Empresa',
          ticketNumber: ticket.ticketNumber,
          updatedAt: ticket.updatedAt,
        }))
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime(),
        );

      setTickets(assignedTickets);
      setFilteredTickets(assignedTickets);
    } catch (err) {
      console.log(err);
      setError('Erro ao carregar tickets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredTickets(tickets);
      return;
    }

    const filtered = tickets.filter(ticket =>
      ticket.companyName
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

    setFilteredTickets(filtered);
  }, [search, tickets]);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={Colors.teal.base}
        />

        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar empresa..."
          placeholderTextColor={Colors.black[300]}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.teal.base}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredTickets}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: '/chat',
                  params: {
                    ticketId: item.id,
                  },
                })
              }
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="business-outline"
                  size={24}
                  color={Colors.teal.base}
                />
              </View>

              <View style={styles.infoContainer}>
                <Text style={styles.companyName}>
                  {item.companyName}
                </Text>

                <Text style={styles.ticketInfo}>
                  Ticket #{item.ticketNumber}
                </Text>

                <Text style={styles.ticketInfo}>
                  Atualizado em{' '}
                  {new Date(item.updatedAt).toLocaleDateString(
                    'pt-BR',
                  )}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text
              style={[
                globalStyles.text2,
                styles.emptyText,
              ]}
            >
              Nenhum ticket encontrado
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[300],
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white.base,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: Colors.black.base,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: Colors.white.base,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.teal.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    color: Colors.black.base,
    fontFamily: globalStyles.title1.fontFamily,
    marginBottom: 4,
  },
  ticketInfo: {
    fontSize: 13,
    color: Colors.black.base,
    opacity: 0.7,
  },
  errorText: {
    color: Colors.red.base,
    textAlign: 'center',
    marginTop: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.black.base,
  },
});