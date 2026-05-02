import Button from '@/components/Button/Button';
import TicketCard, { TicketStatus } from '@/components/TicketCard/ticketcard';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { authService } from '@/services/authService';
import { TicketResponse, ticketService } from '@/services/ticket';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';

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

const OPEN_STATUSES: TicketStatus[] = ['OPENED', 'TRIAGE', 'ESCALATED'];

const ORBI_LOGO = require('../../../assets/logos/Orbi.png');
const ORBI_SLEEP_LOGO = require('../../../assets/logos/Orbi Sleep.png');

export default function Index() {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);
  const handlePress = () => {
    router.push('/triage-intro');
  };

  const loadOpenTickets = useCallback(async () => {
    setTicketsError(null);
    setTicketsLoading(true);
    try {
      const response = await ticketService.list({ page: 1, limit: 20 });
      const openTickets = response.data
        .filter((ticket) => OPEN_STATUSES.includes(ticket.status))
        .slice(0, 5);
      setTickets(openTickets.map(toCardTicket));
    } catch (err) {
      setTicketsError('Erro ao carregar chamados');
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await authService.getName();
        if (mounted) setName(user.name);
      } catch (err) {
        console.error('Erro ao buscar perfil', err);
      } finally {
        if (mounted) setLoading(false);   
      }

    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    loadOpenTickets();
  }, [loadOpenTickets]);

  const logoSource = tickets.length > 0 ? ORBI_LOGO : ORBI_SLEEP_LOGO;

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={logoSource}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[globalStyles.title2, styles.title]}>
          Olá, {name || 'usuário'}! {'\n'}
          Tudo em órbita?
        </Text>
      </View>
        {!ticketsLoading && !ticketsError && tickets.length > 0 && (
          <Text style={[globalStyles.text2, styles.subtitle]}>Chamados em Aberto</Text>
        )}
        {ticketsLoading ? (
          <ActivityIndicator size="large" color={Colors.teal.base} />
        ) : ticketsError ? (
          <Text style={[globalStyles.text2, styles.description]}>{ticketsError}</Text>
        ) : tickets.length > 0 ? (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TicketCard
                ticket={item}
                cardStyle={styles.ticketCard}
                onPress={(id) => router.push({ pathname: '/chat', params: { ticketId: id } })}
              />
            )}
            contentContainerStyle={styles.ticketsContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text style={[globalStyles.text2, styles.description]}>
            Você não tem nenhum chamado em aberto no momento.
          </Text>
        )}
      
      <View style={styles.buttonContainer}>
        <Button label="+ Abrir Chamado" onPress={handlePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[300],
    paddingHorizontal: 40,
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    lineHeight: 42, 
    letterSpacing: 0.5,
    color: Colors.teal.base,
  },
  subtitle: {
    marginTop: 4, 
    lineHeight: 42,
    letterSpacing: 0.5,
    color: Colors.teal.base,
  },
  description: {
    textAlign: 'center',
    marginTop: 12,
    color: Colors.black.base,
    lineHeight: 22,
    letterSpacing: 0.2,
  },

  ticketsContainer: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingBottom: 8,
  },
  ticketCard: {
    marginHorizontal: 0,
  },

  buttonContainer: {
    width: '100%',
    marginTop: 24,
  },
});