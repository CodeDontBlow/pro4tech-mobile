import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import { authService } from '@/services/authService';
import { TicketResponse, ticketService } from '@/services/ticket';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../../../components/Avatar/Avatar';

export default function AgentHome() {
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);  
  const [user, setUser] = useState({ id: '', name: '' });
  const orbi = require('../../../assets/logos/orbi-happy.png') as any;

  const groups = Array.from(
    new Map(
      tickets.map(ticket => [
        ticket.supportGroup?.id ?? 'without-group',
        ticket.supportGroup,
      ])
    ).values()
  );

  useEffect(() => {
    loadTickets();
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const response = await authService.getName();
      setUser(response);
    } catch (err) {
      console.error('Erro ao carregar atendente atual:', err);
    }
  }

  async function loadTickets() {
    try {
      const response = await ticketService.list({ status: ['OPENED', 'RESOLVED', 'ESCALATED', 'TRIAGE']});
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

  function formatTicketDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.teal.base} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        
        <Image source={orbi} style={styles.orbi} />

        <Text style={[globalStyles.title2, styles.title]}>Fila de Ticket</Text>

        <Text style={[globalStyles.text2, styles.subtitle]}>
          Clique em um chamado aberto para começar a atender.
        </Text>
      </View>

      {groups.map(group => {
        const groupTickets = tickets.filter(
          ticket => ticket.supportGroup?.id === group?.id
        );

        return(
          <View key={group?.id} style={[styles.groupCard]}>
            <Text style={[globalStyles.text1, styles.groupName]}>
              {group?.name}
            </Text>
          
            {groupTickets.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={[
                  styles.card,
                  ticket.agentId !== user.id && styles.cardDisabled,
                ]}
                disabled={ticket.agentId !== user.id}
                onPress={() => ticket.agentId === user.id && router.push({ pathname: '/(agent)/chat' })}
              >
                <View style={styles.cardContent}>
                  <Avatar
                    src={ticket.company?.logoUrl}
                    ratio={40}
                    alt={ticket.company?.name || 'Empresa'}
                  />

                  <View style={styles.cardInfo}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[globalStyles.text1, styles.subject, 
                  ticket.agentId !== user.id && styles.subjectDisabled]}>
                      {ticket.subject?.name}
                    </Text>

                    <View style={styles.cardFooter}>
                      <Text style={[globalStyles.label1, styles.sub]}>
                        {ticket.agent?.user?.name ?
                        ticket.agent?.user?.name
                        : <TouchableOpacity onPress={() => assumeTicket(ticket.id)}>
                            <Text style={styles.assumeButton}>Assumir chamado</Text>
                          </TouchableOpacity>}
                      </Text>

                      <Text style={[globalStyles.label2, styles.sub]}>
                        {formatTicketDate(ticket.createdAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

          </View>
        )
      })}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white.base,
    padding: 14,
  },
  header:{
    alignItems: 'center',
  },
  orbi: {
    width: 163,
    height: 125,
    marginBottom: 12,
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
  groupName: {
    fontWeight: '600',
    color: Colors.teal[700],
  },
  groupCard: {
    backgroundColor: Colors.white[500],
    padding: 14,
    paddingVertical: 20,
    borderRadius: 8,
    marginBottom: 16,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.white[300],
    padding: 12,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    outlineWidth: 1,
    outlineColor: Colors.white[700],
    outlineStyle: 'solid',
  },
  cardDisabled: {
    opacity: 0.8,
    outlineWidth: 0,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  cardInfo: {
    flex: 1,
    gap: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  subject: {
    color: Colors.teal.base,
    fontWeight: '600',
  },
  subjectDisabled: {
    color: Colors.black[300],
    fontWeight: '400',
  },
  company: {
    marginBottom: 10,
    color: Colors.black.base,
  },
  sub: {
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
  assumeButton: {
    backgroundColor: Colors.green.base,
    color: Colors.white.base,
    fontWeight: '600',
  },
});