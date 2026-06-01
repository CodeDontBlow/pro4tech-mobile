import TicketCard from '@/components/TicketCard/ticketcard';
import { Filter, FilterOption } from '@/components/Filter/filter';

import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { statusLabelMap, type TicketStatus } from '@/constants/ticket-status';
import { TicketResponse, ticketService } from '@/services/ticket';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import tickets from '@/app/(agent)/(tabs)/tickets';

type Ticket = {
  id: string;
  agent: { name: string; avatar?: string };
  lastMessage: string;
  status: TicketStatus;
  closedAt: Date | null;
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
  closedAt: ticket.closedAt ? new Date(ticket.closedAt) : null,
});


const statusOptions = [
  { label: 'Todos os status', value: 'all' },
  { label: 'Aberto', value: 'open' },
  { label: 'Em andamento', value: 'in_progress' },
  { label: 'Concluído', value: 'concluded' },
  { label: 'Cancelado', value: 'cancelled' },
];

const monthOptions = [
  { label: 'Jan', value: '01' },
  { label: 'Fev', value: '02' },
  { label: 'Mar', value: '03' },
  { label: 'Abr', value: '04' },
  { label: 'Mai', value: '05' },
  { label: 'Jun', value: '06' },
  { label: 'Jul', value: '07' },
  { label: 'Ago', value: '08' },
  { label: 'Set', value: '09' },
  { label: 'Out', value: '10' },
  { label: 'Nov', value: '11' },
  { label: 'Dez', value: '12' },
];

const yearOptions = [
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
];

export default function History() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState('all');

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0'); 
  const currentYear = String(new Date().getFullYear());

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);



  const filteredTickets = useMemo(() => {
  return tickets.filter((ticket: Ticket) => {
    const matchStatus = status === 'all' || ticket.status === status;

    if (!ticket.closedAt) return matchStatus;

    const matchMonth = String(ticket.closedAt.getMonth() + 1).padStart(2, '0') === month;
    const matchYear = String(ticket.closedAt.getFullYear()) === year;

    return matchStatus && matchMonth && matchYear;
  });
}, [tickets, status, month, year]);

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

  const [selectedFilter, setSelectedFilter] = useState("todos");

  const handleFilterChange = (option: FilterOption) => {
    setSelectedFilter(option.value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[globalStyles.title2, styles.title]}>
          Histórico de Chamados
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={{ flex: 4 }}>
          <Filter options={statusOptions} defaultValue="all" onChange={(o) => setStatus(o.value)} />
        </View>
        <View style={{ flex: 1 }}>
          <Filter options={monthOptions} defaultValue="06" onChange={(o) => setMonth(o.value)} />
        </View>
        <View style={{ flex: 1 }}>
          <Filter options={yearOptions} defaultValue="2026" onChange={(o) => setYear(o.value)} />
        </View>
      </View>

      <View style={styles.ticketsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.teal.base} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>{tickets.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum chamado encontrado.</Text>
        ) : (
          <FlatList
            data={filteredTickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TicketCard
                ticket={item}
                onPress={(id) => router.push({ pathname: '/chat', params: { ticketId: id } })}
              />
            )}
          />
        )}</>)}
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
    flexDirection: 'row',
    paddingHorizontal: 40,
    paddingBottom: 16,
    gap: 8,
    zIndex: 1,
  },
  
  ticketsContainer: {
    flex: 1,
    paddingHorizontal: 32,
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