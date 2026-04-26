import React, { useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import ChatInput from '@/components/ChatInput/ChatInput';
import DateSeparator from '@/components/DateSeparator/DateSeparator';
import Header from '@/components/Header/Header';
import SpeechBubble from '@/components/SpeechBubble/SpeechBubble';
import Alert from '@/components/Alert/Alert';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';

type Message = {
  id: string;
  type: 'user' | 'bot';
  text: string;
};

const MOCK_AGENT_NAME = 'Luana Moraes Souza';
const MOCK_STATUS = 'Aberto';

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'bot', text: 'Bom dia, eu sou a Luana, como posso te ajudar?' },
    { id: '2', type: 'user', text: 'Estou tentando cadastrar um produto no sistema mas aparece um erro' },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = (text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      text,
    };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleDelete = () => {
    setMessages(prev => prev.filter(m => m.id !== selectedId));
    setSelectedId(null);
  };

  return (
    <View style={styles.container}>
      <Header title="ORBITA" showBack showProfile />

      <View style={styles.ticketInfo}>
        <Text style={[globalStyles.text2, styles.agentName]}>{MOCK_AGENT_NAME}</Text>
        <View style={styles.statusBadge}>
          <Text style={[globalStyles.label1, styles.statusText]}>{MOCK_STATUS}</Text>
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