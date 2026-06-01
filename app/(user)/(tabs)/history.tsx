import TicketCard from '@/components/TicketCard/ticketcard';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { statusLabelMap, type TicketStatus } from '@/constants/ticket-status';
import { TicketResponse, ticketService } from '@/services/ticket';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Ticket = {
  id: string;
  agent: { name: string; avatar?: string };
  lastMessage: string;
  status: TicketStatus;
  createdAt: string;
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
  createdAt: ticket.createdAt,
});

const monthLabels = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export default function History() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | 'ALL'>('ALL');
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | 'ALL'>(
    'ALL'
  );
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

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

  const monthOptions = useMemo(
    () => [
      { value: 'ALL', label: 'Todos' },
      ...monthLabels.map((label, index) => ({
        value: index + 1,
        label,
      })),
    ],
    []
  );

  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    tickets.forEach((ticket) => {
      const date = new Date(ticket.createdAt);
      if (Number.isNaN(date.getTime())) return;
      years.add(date.getFullYear());
    });

    const sorted = Array.from(years.values()).sort((a, b) => b - a);
    return [
      { value: 'ALL', label: 'Todos' },
      ...sorted.map((value) => ({ value, label: String(value) })),
    ];
  }, [tickets]);

  const statusOptions = useMemo(
    () => [
      { value: 'ALL', label: 'Todos' },
      ...Object.entries(statusLabelMap).map(([value, label]) => ({
        value,
        label,
      })),
    ],
    []
  );

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      if (selectedStatus !== 'ALL' && ticket.status !== selectedStatus) {
        return false;
      }

      const date = new Date(ticket.createdAt);
      if (Number.isNaN(date.getTime())) return false;

      if (selectedYear !== 'ALL' && date.getFullYear() !== selectedYear) {
        return false;
      }

      if (selectedMonth !== 'ALL' && date.getMonth() + 1 !== selectedMonth) {
        return false;
      }

      return true;
    });
  }, [tickets, selectedMonth, selectedStatus, selectedYear]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[globalStyles.title2, styles.title]}>
          Histórico de Chamados
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterColumnWide}>
            <View style={styles.filterLabelRow}>
              <Ionicons name="flag-outline" size={16} color={Colors.teal[500]} />
              <Text style={styles.filterLabel}>Status</Text>
            </View>
            <View style={styles.selectButton}>
              <Picker
                selectedValue={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value as TicketStatus | 'ALL');
                  setIsStatusOpen(false);
                }}
                onFocus={() => setIsStatusOpen(true)}
                onBlur={() => setIsStatusOpen(false)}
                style={[
                  styles.picker,
                  Platform.OS === 'web'
                    ? ({
                        outlineStyle: 'none',
                        outlineWidth: 0,
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                        appearance: 'none',
                      } as any)
                    : null,
                ]}
                dropdownIconColor={Colors.black[300]}
              >
                {statusOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
              <Ionicons
                name={isStatusOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={Colors.black[300]}
                style={styles.dropdownIndicator}
              />
            </View>
          </View>

          <View style={styles.filterColumnCompact}>
            <View style={styles.filterLabelRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.teal[500]} />
              <Text style={styles.filterLabel}>Mês</Text>
            </View>
            <View style={styles.selectButton}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(value) => {
                  const nextValue = value === 'ALL' ? 'ALL' : Number(value);
                  setSelectedMonth(nextValue);
                  setIsMonthOpen(false);
                }}
                onFocus={() => setIsMonthOpen(true)}
                onBlur={() => setIsMonthOpen(false)}
                style={[
                  styles.picker,
                  Platform.OS === 'web'
                    ? ({
                        outlineStyle: 'none',
                        outlineWidth: 0,
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                        appearance: 'none',
                      } as any)
                    : null,
                ]}
                dropdownIconColor={Colors.black[300]}
              >
                {monthOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))} 
              </Picker>
              <Ionicons
                name={isMonthOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={Colors.black[300]}
                style={styles.dropdownIndicator}
              />
            </View>
          </View>

          <View style={styles.filterColumnCompact}>
            <View style={styles.filterLabelRow}>
              <Ionicons name="calendar-outline" size={16} color={Colors.teal[500]} />
              <Text style={styles.filterLabel}>Ano</Text>
            </View>
            <View style={styles.selectButton}>
              <Picker
                selectedValue={selectedYear}
                onValueChange={(value) => {
                  const nextValue = value === 'ALL' ? 'ALL' : Number(value);
                  setSelectedYear(nextValue);
                  setIsYearOpen(false);
                }}
                onFocus={() => setIsYearOpen(true)}
                onBlur={() => setIsYearOpen(false)}
                style={[
                  styles.picker,
                  Platform.OS === 'web'
                    ? ({
                        outlineStyle: 'none',
                        outlineWidth: 0,
                        borderWidth: 0,
                        backgroundColor: 'transparent',
                        appearance: 'none',
                      } as any)
                    : null,
                ]}
                dropdownIconColor={Colors.black[300]}
              >
                {yearOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
              <Ionicons
                name={isYearOpen ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={Colors.black[300]}
                style={styles.dropdownIndicator}
              />
            </View>
          </View>
        </View>
      </View>

<View style={styles.ticketsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.teal.base} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
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

// ===================================== //

  filterContainer: {
    marginHorizontal: 34,
    marginBottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  filterColumnWide: {
    flex: 2,
    gap: 8,
  },
  filterColumnCompact: {
    flex: 1,
    gap: 8,
  },
  filterGroup: {
    gap: 8,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterLabel: {
    color: Colors.black.base,
    fontSize: 14,
    fontFamily: globalStyles.text2.fontFamily,
  },
  selectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectButton: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.white[700],
    backgroundColor: Colors.white[300],
    overflow: 'hidden',
    position: 'relative',
  },
  picker: {
    height: 38,
    color: Colors.black.base,
    fontSize: 14,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  dropdownIndicator: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
//  ==================================== //


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