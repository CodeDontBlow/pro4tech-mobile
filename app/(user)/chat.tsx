import Alert from '@/components/Alert/Alert';
import ChatInput from '@/components/ChatInput/ChatInput';
import DateSeparator from '@/components/DateSeparator/DateSeparator';
import Header from '@/components/Header/Header';
import SpeechBubble from '@/components/SpeechBubble/SpeechBubble';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import api from '@/services/api';
import { authService } from '@/services/authService';
import { TicketResponse, ticketService, TicketStatus } from '@/services/ticket';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Socket, io } from 'socket.io-client';

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
  time: string;
};

type ChatMessageOutput = {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: 'CLIENT' | 'AGENT' | 'ADMIN';
  content: string;
  createdAt: string | Date;
};

const statusLabelMap: Record<TicketStatus, string> = {
  TRIAGE: 'Triagem',
  OPENED: 'Aberto',
  ESCALATED: 'Escalado',
  CLOSED: 'Fechado',
  RESOLVED: 'Resolvido',
};

const getAgentName = (ticket: TicketResponse | null) =>
  ticket?.agent?.user?.name ||
  ticket?.supportGroup?.name ||
  ticket?.subject?.name ||
  ' ';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ticket, setTicket] = useState<TicketResponse | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const socketRef = useRef<Socket | null>(null);

  const handleSend = (text: string) => {
    if (!ticketId || !socketRef.current) return;
    socketRef.current.emit('sendMessage', { ticketId, content: text });
  };

  const handleDelete = () => {
    setMessages(prev => prev.filter(m => m.id !== selectedId));
    setSelectedId(null);
  };

  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();

  const formatMessageTime = (value: string | Date) => {
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const toMessage = (message: ChatMessageOutput): Message => ({
    id: message.id,
    type: message.senderRole === 'CLIENT' ? 'user' : 'bot',
    text: message.content,
    time: formatMessageTime(message.createdAt),
  });

  useEffect(() => {
    if (!ticketId) return;
    let isMounted = true;

    (async () => {
      try {
        const data = await ticketService.getById(ticketId);
        if (isMounted) setTicket(data);
      } catch (err) {
        if (isMounted) setTicket(null);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [ticketId]);

  useEffect(() => {
    if (!ticketId) return;
    let isMounted = true;

    setMessages([]);

    (async () => {
      const token = await authService.getToken();
      const baseUrl = api.defaults.baseURL;
      if (!token || !baseUrl) return;

      const normalizedBaseUrl = baseUrl.endsWith('/')
        ? baseUrl.slice(0, -1)
        : baseUrl;

      const socket = io(`${normalizedBaseUrl}/chat`, {
        auth: { token },
        transports: ['websocket'],
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        socket.emit('joinRoom', { ticketId });
      });

      socket.on('chatHistory', (history: ChatMessageOutput[]) => {
        if (!isMounted) return;
        setMessages(history.map(toMessage));
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: false }), 50);
      });

      socket.on('newMessage', (message: ChatMessageOutput) => {
        if (!isMounted) return;
        setMessages((prev) => [...prev, toMessage(message)]);
        setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 50);
      });
    })();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [ticketId]);

  const agentName = getAgentName(ticket);
  const statusLabel = ticket ? statusLabelMap[ticket.status] : 'Carregando';

  return (
    <View style={styles.container}>
      <Header title="ORBITA" showBack showProfile />

      <View style={styles.ticketInfo}>
        <Text style={[globalStyles.text2, styles.agentName]}>{agentName}</Text>
        <View style={styles.statusBadge}>
          <Text style={[globalStyles.label1, styles.statusText]}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <DateSeparator label={new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })} />

        {messages.map(message => (
          <SpeechBubble
            key={message.id}
            type={message.type}
            text={message.text}
            time={message.time}
            onLongPress={() => setSelectedId(message.id)}
            onPress={() => setSelectedId(message.id)}
          />
        ))}
      </ScrollView>

      <ChatInput onSend={handleSend} />

      <Alert
        visible={selectedId !== null}
        title="Apagar mensagem"
        message="Deseja apagar esta mensagem?"
        confirmLabel="Apagar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setSelectedId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[300],
  },
  ticketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  agentName: {
    color: Colors.black.base,
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: Colors.green.base,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    color: Colors.white[300],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.white[500],
  },
  messages: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
});