import TicketCard from '@/components/TicketCard/ticketcard';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type Ticket = {
  id: string;
  agent: { name: string; avatar?: string };
  lastMessage: string;
  status: 'ABERTO' | 'ENCERRADO';
};

// Dados de teste
const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    agent: { name: 'Mariana Silva', avatar: 'https://randomuser.me/api/portraits/women/76.jpg' },
    lastMessage: 'Olá! Atualizei seu chamado.',
    status: 'ABERTO',
  },
  {
    id: '2',
    agent: { name: 'Carlos Souza', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
    lastMessage: 'Seu problema foi resolvido.',
    status: 'ENCERRADO',
  },
  {
    id: '3',
    agent: { name: 'Ana Costa', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    lastMessage: 'Preciso de mais informações...',
    status: 'ABERTO',
  },
    {
    id: '4',
    agent: { name: 'Ana Costa', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    lastMessage: 'Preciso de mais informações...',
    status: 'ABERTO',
  },
    {
    id: '5',
    agent: { name: 'Ana Costa', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    lastMessage: 'Preciso de mais informações...',
    status: 'ABERTO',
  },
    {
    id: '6',
    agent: { name: 'Ana Costa', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
    lastMessage: 'Preciso de mais informações...',
    status: 'ABERTO',
  },
];

export default function History() {
  const [tickets] = useState<Ticket[]>(MOCK_TICKETS);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={[globalStyles.title2, styles.title]}>
          Histórico de Chamados
        </Text>        
      </View>
      <FlatList
        data={tickets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TicketCard ticket={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  titleContainer: {
    padding: 16,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  title: {
    color: Colors.teal.[700],
    fontSize: 24,   
  }
});