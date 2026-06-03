import TicketCard from '@/components/TicketCard/ticketcard';
import { Filter } from '@/components/Filter/filter';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { type TicketStatus } from '@/constants/ticket-status';
import { TicketResponse, ticketService } from '@/services/ticket';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Ticket = {
  id: string;
  agent: { name: string; avatar?: string };
  lastMessage: string;
  status: TicketStatus;
  createdAt: Date;
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
  createdAt: new Date(ticket.createdAt),
});

const statusOptions = [
  { label: 'Todos os status', value: 'all' },
  { label: 'Triagem', value: 'TRIAGE' },
  { label: 'Aberto', value: 'OPENED' },
  { label: 'Resolvido', value: 'RESOLVED' },
  { label: 'Encerrado', value: 'CLOSED' },
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
  const [openFilter, setOpenFilter] = useState<'status' | 'month' | 'year' | null>(null);

  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const currentYear = String(new Date().getFullYear());

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket: Ticket) => {
      const matchStatus = status === 'all' || ticket.status === status;
      const matchMonth = String(ticket.createdAt.getMonth() + 1).padStart(2, '0') === month;
      const matchYear = String(ticket.createdAt.getFullYear()) === year;
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

  return (
    <View style={styles.container}>

      {/* Backdrop global — fecha qualquer filtro ao tocar fora */}
      {openFilter !== null && (
        <Pressable
          style={StyleSheet.absoluteFillObject}
          onPress={() => setOpenFilter(null)}
        />
      )}

      <View style={styles.titleContainer}>
        <Text style={[globalStyles.title2, styles.title]}>
          Histórico de Chamados
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={{ flex: 2 }}>
          <Filter
            isOpen={openFilter === 'status'}
            onToggle={() => setOpenFilter(openFilter === 'status' ? null : 'status')}
            onClose={() => setOpenFilter(null)}
            options={statusOptions}
            defaultValue="all"
            onChange={(o) => setStatus(o.value)}
          />
        </View>
        <View style={{ flex: 1, minWidth: 80 }}>
          <Filter
            isOpen={openFilter === 'month'}
            onToggle={() => setOpenFilter(openFilter === 'month' ? null : 'month')}
            onClose={() => setOpenFilter(null)}
            options={monthOptions}
            defaultValue={currentMonth}
            onChange={(o) => setMonth(o.value)}
          />
        </View>
        <View style={{ flex: 1, minWidth: 72 }}>
          <Filter
            isOpen={openFilter === 'year'}
            onToggle={() => setOpenFilter(openFilter === 'year' ? null : 'year')}
            onClose={() => setOpenFilter(null)}
            options={yearOptions}
            defaultValue={currentYear}
            onChange={(o) => setYear(o.value)}
          />
        </View>
      </View>

      <View style={styles.ticketsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.teal.base} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {filteredTickets.length === 0 ? (
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
            )}
          </>
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
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 10,
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