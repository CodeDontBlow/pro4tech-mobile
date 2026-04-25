import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import Button from '@/components/Button/Button';
import OrbiAvatar from '@/components/OrbiAvatar/OrbiAvatar';
import SpeechBubble from '@/components/SpeechBubble/SpeechBubble';
import Colors from '@/constants/colors';
import api from '@/services/api';

type Message = {
  id: string;
  type: 'question' | 'answer';
  text: string;
  options?: any[];
};

export default function Triage() {
  const [node, setNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const fetchFirstQuestion = async () => {
    setLoading(true);
    try {
      const response = await api.get('/triage-rules/root');
      const data = response.data;
      setNode(data);
      setMessages([{
        id: 'initial',
        type: 'question',
        text: data.question,
        options: data.children,
      }]);
    } catch (err) {
      console.error('Erro ao carregar início:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (option: any) => {
    setMessages(prev => [...prev, {
      id: `answer-${Date.now()}`,
      type: 'answer',
      text: option.answerTrigger,
    }]);

    setLoading(true);
    try {
      const response = await api.post(`/triage-rules/${node.id}/traverse`, {
        answerTrigger: option.answerTrigger,
      });

      const data = response.data;

      if (data.isLeaf) {
        router.push({
          pathname: '/(user)/triage-end',
          params: {
            groupName: data.supportGroup.name,
            subjectName: data.subject.name,
          },
        });
      } else {
        setNode(data);
        setMessages(prev => [...prev, {
          id: `question-${Date.now()}`,
          type: 'question',
          text: data.question,
          options: data.children,
        }]);
      }
    } catch (err) {
      console.error('Erro ao responder:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFirstQuestion(); }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.teal.base} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <OrbiAvatar variant="default" size={120} />

        {messages.map((message) => (
          <SpeechBubble
            key={message.id}
            type={message.type === 'answer' ? 'user' : 'bot'}
            text={message.text}
            options={message.options}
          />
        ))}

        {loading && (
          <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color={Colors.teal.base} />
          </View>
        )}
      </ScrollView>

      <View style={styles.optionsContainer}>
        <View style={styles.buttons}>
          {node?.children?.map((option: any, index: number) => (
            <Button
              style={styles.button}
              textStyle={styles.buttonText}
              key={option.id}
              label={`${index + 1}`}
              onPress={() => handleAnswer(option)}
              disabled={loading}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[300],
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white[300],
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  loadingBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white[500],
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },
  optionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  buttons: {
    width: '100%',
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    backgroundColor: Colors.white[500],
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 0,
    marginTop: 0,
  },
  buttonText: {
    color: Colors.teal.base,
    fontWeight: '700',
  },
});