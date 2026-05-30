import { globalStyles } from "@/constants/globalStyles";
import {
  CLOSED_LIKE_STATUSES,
  statusLabelMap,
  type TicketStatus,
} from "@/constants/ticket-status";
import React from "react";
import { Image, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import styles from "./ticketcard.styles";

type Ticket = {
  id: string;
  agent: { name: string; avatar?: string };
  lastMessage: string;
  status: TicketStatus;
};

type Props = {
  ticket: Ticket;
  onPress?: (ticketId: string) => void;
  cardStyle?: StyleProp<ViewStyle>;
};

export default function TicketCard({ ticket, onPress, cardStyle }: Props) {
  const statusLabel = statusLabelMap[ticket.status] ?? ticket.status;
  const isClosed = CLOSED_LIKE_STATUSES.includes(ticket.status);
  const avatarUri = ticket.agent.avatar?.trim()
    ? ticket.agent.avatar
    : 'https://via.placeholder.com/44';

  return (
    <Pressable style={[styles.card, cardStyle]} onPress={() => onPress?.(ticket.id)}>
      <View>
        <View style={styles.top}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <Text style={[globalStyles.subtitle2, styles.name]}>{ticket.agent.name}</Text>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.message} numberOfLines={1}>
            {ticket.lastMessage}
          </Text>
          <Text style={[styles.status, isClosed ? styles.closed : styles.open]}>
            {statusLabel}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}