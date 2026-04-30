// import { HeaderTitle } from "@react-navigation/elements";
// import { StyleSheet, View } from "react-native";

// export default function Index() {
//   return (
//     <View style={styles.container}>
//       <HeaderTitle>Histórico de Chamados</HeaderTitle>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });


import TicketCard from '@/components/TicketCard/ticketcard';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

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
];

export default function History() {
  const [tickets] = useState<Ticket[]>(MOCK_TICKETS);

  return (
    <View style={styles.container}>
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
});