import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { io, Socket } from 'socket.io-client';
import Header from '@/components/Header/Header';
import Button from '@/components/Button/Button';
import ChatInput from '@/components/ChatInput/ChatInput';
import DateSeparator from '@/components/DateSeparator/DateSeparator';
import SpeechBubble from '@/components/SpeechBubble/SpeechBubble';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import api from '@/services/api';
import { authService } from '@/services/authService';

type ChatMessage = {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: 'CLIENT' | 'AGENT' | 'ADMIN';
  content?: string;
  attachments?: {
    url: string;
    mimeType: string;
    originalName: string;
    size: number;
  }[];
  createdAt: string;
  editedAt?: string | null;
  deletedAt?: string | null;
};

const formatTime = (value?: string) => {
  if (!value) return undefined;
  return new Date(value).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function AgentChat() {
  const params = useLocalSearchParams<{ ticketId?: string | string[] }>();

  const ticketId = Array.isArray(params.ticketId)
    ? params.ticketId[0]
    : params.ticketId;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ticket, setTicket] = useState<any>();
  const [ticketStatus, setTicketStatus] = useState('OPEN');
  const [isClosed, setIsClosed] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const socketRef = useRef<Socket | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    authService.getToken().then(setAuthToken);
  }, []);

  async function loadTicket() {
    if (!ticketId) return;

    try {
      const response = await api.get(`/tickets/${ticketId}`);
      setTicket(response.data);
      setTicketStatus(response.data.status);

      if (response.data.status === 'CLOSED') {
        setIsClosed(true);
      }
    } catch (err) {
      console.log('Erro ticket:', err);
    }
  }

  useEffect(() => {
    if (!ticketId) return;

    loadTicket();
    pollingRef.current = setInterval(loadTicket, 5000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [ticketId]);

  useEffect(() => {
    if (!ticketId || !authToken) return;

    const socket = io(`${api.defaults.baseURL}/chat`, {
      auth: { token: authToken },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinRoom', { ticketId });
    });

    socket.on('chatHistory', (history) => {
      setMessages(history);
    });

    socket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('updatedMessage', (message) => {
      setMessages((prev) =>
        prev.map((item) => (item.id === message.id ? message : item))
      );
    });

    socket.on('deletedMessage', (message) => {
      setMessages((prev) =>
        prev.map((item) => (item.id === message.id ? message : item))
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [ticketId, authToken]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const orderedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages]);

  function handleSend() {
    if (!ticketId || !messageText.trim() || isClosed) return;

    socketRef.current?.emit('sendMessage', {
      ticketId,
      content: messageText.trim(),
    });

    setMessageText('');
  }

  async function closeTicket() {
    try {
      if (!ticketId) return;

      await api.patch(`/tickets/${ticketId}`, { status: 'CLOSED' });

      setTicketStatus('CLOSED');
      setIsClosed(true);

      await loadTicket();

      socketRef.current?.disconnect();
      socketRef.current = null;

      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    } catch (error: any) {
      console.log('Erro ao encerrar ticket:', error.response?.data ?? error);
    }
  }

  return (
    <View style={styles.container}>
      <Header
        title="ORBITA"
        showBack
        showProfile
        onBack={() => router.back()}
      />

      <View style={styles.ticketInfo}>
        <Text
          numberOfLines={1}
          style={[globalStyles.text2, styles.ticketTitle]}
        >
          {ticket?.subject?.name ?? 'Chamado'}
          {' - '}
          {ticket?.company?.name ?? ''}
        </Text>

        {!isClosed ? (
          <Button
            label="Encerrar"
            variant="error"
            onPress={closeTicket}
            style={styles.closeButton}
            textStyle={styles.closeButtonText}
          />
        ) : (
          <Button
            label="Encerrado"
            variant="error"
            disabled
            onPress={() => {}}
            style={styles.closedButton}
            textStyle={styles.closeButtonText}
          />
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messages}
        showsVerticalScrollIndicator={false}
      >
        <DateSeparator label={new Date().toLocaleDateString('pt-BR')} />

        {orderedMessages.map((message) => (
          <SpeechBubble
            key={message.id}
            type={
              message.senderRole === 'AGENT' || message.senderRole === 'ADMIN'
                ? 'user'
                : 'bot'
            }
            text={message.deletedAt ? 'Mensagem removida' : message.content ?? ''}
            attachments={message.attachments}
            time={formatTime(message.createdAt)}
          />
        ))}
      </ScrollView>

      {!isClosed && (
        <ChatInput
          value={messageText}
          onChangeText={setMessageText}
          onSend={handleSend}
        />
      )}
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
    paddingVertical: 14,
    gap: 12,
  },
  ticketTitle: {
    flex: 1,
    color: Colors.black.base,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 95,
    height: 32,
    justifyContent: 'center',
  },
  closedButton: {
    width: 95,
    height: 32,
    opacity: 0.7,
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 13,
  },
  messages: {
    flex: 1,
    paddingHorizontal: 16,
  },
});