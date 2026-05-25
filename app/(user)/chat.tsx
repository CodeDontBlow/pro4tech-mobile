import Alert from '@/components/Alert/Alert';
import ChatInput from '@/components/ChatInput/ChatInput';
import DateSeparator from '@/components/DateSeparator/DateSeparator';
import FilePreview from '@/components/FilePreview/FilePreview';
import Header from '@/components/Header/Header';
import RatingModal from '@/components/RatingScore/RatingScore';
import SpeechBubble from '@/components/SpeechBubble/SpeechBubble';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import api from '@/services/api';
import { authService } from '@/services/authService';
import {
  LocalAttachment,
  uploadChatAttachments,
} from '@/services/upload';
import * as DocumentPicker from 'expo-document-picker';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { io, Socket } from 'socket.io-client';

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

interface TriageItem {
  question: string;
  answer: string;
}

const formatTime = (value?: string) => {
  if (!value) return undefined;
  return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export default function Chat() {
  const params = useLocalSearchParams<{ ticketId?: string | string[] }>();
  const ticketId = Array.isArray(params.ticketId) ? params.ticketId[0] : params.ticketId;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [ticketStatus, setTicketStatus] = useState<string>('Aguardando');
  const [agentLabel, setAgentLabel] = useState<string>('Atendente');
  const [isClosed, setIsClosed] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [triageHistory, setTriageHistory] = useState<TriageItem[]>([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [pendingFiles, setPendingFiles] = useState<LocalAttachment[]>([]);
  const [showFilePreview, setShowFilePreview] = useState(false);
  const ratingPromptedRef = useRef(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const socketRef = useRef<Socket | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    authService.getToken().then(setAuthToken);
  }, []);

  const fetchTicket = async () => {
    if (!ticketId) return;
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      const ticket = response.data;
      if (ticket?.status) {
        setTicketStatus(ticket.status);
        if (ticket.status === 'CLOSED') {
          setIsClosed(true);
          stopPolling();

          if (!ratingPromptedRef.current && !ticket.ratingScore) {
            ratingPromptedRef.current = true;
            setShowRatingModal(true);
          }
        }
      }
      if (ticket?.agentId) {
        setAgentLabel('Atendente conectado');
      }
    } catch (err) {
      console.error('Erro ao carregar ticket', err);
    }
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  useEffect(() => {
    if (!ticketId) return;
    fetchTicket();
    pollingRef.current = setInterval(fetchTicket, 5000);
    return () => stopPolling();
  }, [ticketId]);

  useEffect(() => {
    if (!ticketId || !authToken) return;

    const baseUrl = api.defaults.baseURL;
    if (!baseUrl) return;

    const socket = io(`${baseUrl}/chat`, {
      auth: { token: authToken },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('joinRoom', { ticketId });
    });

    socket.on('chatHistory', (history: ChatMessage[]) => {
      setMessages(history);
    });

    socket.on('newMessage', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('updatedMessage', (message: ChatMessage) => {
      setMessages(prev => prev.map(item => (item.id === message.id ? message : item)));
    });

    socket.on('deletedMessage', (message: ChatMessage) => {
      setMessages(prev => prev.map(item => (item.id === message.id ? message : item)));
    });

    socket.on('socketError', (payload: { message?: string }) => {
      console.error(payload?.message ?? 'Erro no socket');
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [ticketId, authToken]);

  useEffect(() => {
    const fetchTriage = async () => {
      if (!ticketId) return;
      try {
        const res = await api.get(`/tickets/${ticketId}/triage-history`);
        setTriageHistory(res.data);
      } catch (err) {
        console.error('Erro ao carregar triagem', err);
      }
    };
    fetchTriage();
  }, [ticketId]);

  useEffect(() => {
    if (messages.length === 0) return;
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages]);

  const orderedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messages]);

  const handleSend = () => {
    if (!ticketId || !messageText.trim() || isClosed) return;
    socketRef.current?.emit('sendMessage', {
      ticketId,
      content: messageText.trim(),
    });
    setMessageText('');
  };

  const handleSendAttachments = async () => {
    if (!ticketId || isClosed || pendingFiles.length === 0) return;

    try {
      setIsUploading(true);
      const attachments = await uploadChatAttachments(ticketId, pendingFiles);

      socketRef.current?.emit('sendMessage', {
        ticketId,
        content: messageText.trim() || undefined,
        attachments,
      });
      setMessageText('');
      setPendingFiles([]);
      setShowFilePreview(false);
    } catch (error) {
      console.error('Erro ao enviar anexos', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAttachPress = async () => {
    if (isClosed || isUploading) return;

    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      multiple: true,
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const files: LocalAttachment[] = result.assets.map((asset) => ({
      uri: asset.uri,
      name: asset.name ?? 'arquivo',
      mimeType: asset.mimeType,
      file: (asset as any).file ?? null,
    }));

    setPendingFiles(files);
    setShowFilePreview(true);
  };

  const handleDelete = () => {
    if (!ticketId || !selectedId) {
      setSelectedId(null);
      return;
    }
    socketRef.current?.emit('deleteMessage', {
      ticketId,
      messageId: selectedId,
    });
    setSelectedId(null);
  };

  const handleRatingSubmit = async (score: number, comment: string) => {
    if (!ticketId) return;
    await api.patch(`/tickets/${ticketId}`, {
      ratingScore: score,
      ...(comment ? { ratingComment: comment } : {}),
    });
    setShowRatingModal(false);
  };

  const handleRatingDismiss = () => {
    setShowRatingModal(false);
  };

  return (
    <View style={styles.container}>
      <Header title="ORBITA" showBack showProfile onBack={() => router.replace('/(user)/(tabs)')} />

      <View style={styles.ticketInfo}>
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <View style={[globalStyles.imgWrapper, {width: 32, height: 32}]}>
            <Image source={require('../../assets/logos/orbi-dead.png')} style={globalStyles.wrappedImg}/>
          </View>

          <Text style={[globalStyles.text2, styles.agentName]}>{agentLabel}</Text>
        </View>
        <View style={[styles.statusBadge, isClosed && styles.statusBadgeClosed]}>
          <Text style={[globalStyles.label1, styles.statusText]}>{ticketStatus}</Text>
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

        {triageHistory.map((item, index) => (
          <View key={`triage-${index}`}>
            <SpeechBubble type="bot" text={item.question} time={undefined} />
            <SpeechBubble type="user" text={item.answer} time={undefined} />
          </View>
        ))}

        {orderedMessages.map(message => {
          const sender = message.senderRole
          return (
            <View style={sender === 'AGENT' && styles.messageWrapper}>

              {sender !== 'CLIENT' && (
                <View style={[globalStyles.imgWrapper, {width: 32, height: 32, marginBottom: 20}]}>
                  <Image source={require('../../assets/logos/orbi-dead.png')} accessibilityLabel='Foto do atendente' style={globalStyles.wrappedImg}/>
                </View>
              )}

              <SpeechBubble
                key={message.id}
                type={sender === 'CLIENT' ? 'user' : 'bot'}
                text={message.deletedAt ? 'Mensagem removida' : message.content ?? ''}
            attachments={message.deletedAt ? [] : message.attachments}
                time={formatTime(message.createdAt)}
                onLongPress={sender === 'CLIENT' ? () => setSelectedId(message.id) : undefined}
                onPress={sender === 'CLIENT' ? () => setSelectedId(message.id) : undefined}
              />
            </View>
          )
        })}

        {isClosed && (
          <View style={styles.closedContainer}>
            <Text style={[globalStyles.label1, styles.closedText]}>
              Este chamado foi encerrado pelo atendente.
            </Text>
          </View>
        )}
      </ScrollView>

      {!isClosed && (
        <ChatInput
          value={messageText}
          onChangeText={setMessageText}
          onSend={handleSend}
          onAttachPress={handleAttachPress}
          isSending={isUploading}
        />
      )}

      <FilePreview
        visible={showFilePreview}
        files={pendingFiles}
        onCancel={() => {
          setPendingFiles([]);
          setShowFilePreview(false);
        }}
        onRemove={(index) =>
          setPendingFiles((prev) => prev.filter((_, i) => i !== index))
        }
        onConfirm={handleSendAttachments}
        isSending={isUploading}
      />

      <Alert
        visible={selectedId !== null}
        title="Apagar mensagem"
        message="Deseja apagar esta mensagem?"
        confirmLabel="Apagar"
        cancelLabel="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setSelectedId(null)}
      />

      <RatingModal
        visible={showRatingModal}
        onSubmit={handleRatingSubmit}
        onDismiss={handleRatingDismiss}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  messageWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
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
  statusBadgeClosed: {
    backgroundColor: Colors.red.base,
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
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  closedContainer: {
    alignSelf: 'center',
    backgroundColor: Colors.white[500],
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 12,
  },
  closedText: {
    color: Colors.black[300],
    textAlign: 'center',
  },
});