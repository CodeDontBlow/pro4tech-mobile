import React from "react";
import { Image, Text, View } from "react-native";
import styles from "./ticketcard.styles";

type Ticket = {
    id: string;
    agent: {name: string; avatar?: string};
    lastMessage: string;
    status: 'ABERTO' | 'ENCERRADO';
};

type Props = {
    ticket: Ticket;
};

export default function TicketCard({ ticket }: Props) {
  return (
    <View style={styles.card}>
      {/* Topo: Avatar + Nome */}
      <View style={styles.top}>
        <Image
          source={{ uri: ticket.agent.avatar || 'https://via.placeholder.com/44' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{ticket.agent.name}</Text>
      </View>

      {/* Rodapé: Mensagem + Status */}
      <View style={styles.bottom}>
        <Text style={styles.message} numberOfLines={1}>
          {ticket.lastMessage}
        </Text>
        <Text style={[styles.status, ticket.status === 'ABERTO' ? styles.open : styles.closed]}>
          {ticket.status}
        </Text>
      </View>
    </View>
  );
}