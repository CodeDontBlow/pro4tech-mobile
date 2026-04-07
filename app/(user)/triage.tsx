import Button from '@/components/Button/Button';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';
import api from '@/services/api';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

type Message = {
  id: string;
  type: 'question' | 'answer';
  text: string;
  options?: any[];
};

export default function Triagem() {
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
      
      // Adicionar primeira pergunta ao histórico
      setMessages([{
        id: 'initial',
        type: 'question',
        text: data.question,
        options: data.children
      }]);
    } catch (err) {
      console.error("Erro ao carregar início:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (option: any) => {
    // Adicionar resposta do usuário ao histórico
    setMessages(prev => [...prev, {
      id: `answer-${Date.now()}`,
      type: 'answer',
      text: option.answerTrigger
    }]);

    setLoading(true);
    try {
      const response = await api.post(`/triage-rules/${node.id}/traverse`, {
        answerTrigger: option.answerTrigger
      });

      const data = response.data;

      if (data.isLeaf) {
        console.log('Leaf node data:', data);
        router.push({ 
          pathname: '/(user)/triage-end',
          params: { 
            groupName: data.supportGroup.name,
            subjectName: data.subject.name,
          } 
        });
      } else {
        setNode(data);
        // Adicionar nova pergunta ao histórico
        setMessages(prev => [...prev, {
          id: `question-${Date.now()}`,
          type: 'question',
          text: data.question,
          options: data.children
        }]);
      }
    } catch (err) {
      console.error("Erro ao responder:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFirstQuestion(); }, []);

  useEffect(() => {
    // Rolar para o final quando novas mensagens são adicionadas
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  if (loading && messages.length === 0) {
    return <View style={styles.center}><ActivityIndicator size="large" color={Colors.teal.base} /></View>;
  }

  return (
    <View style={styles.container}>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logos/Orbi.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        {messages.map((message) => (
          <View key={message.id} style={[
            styles.messageWrapper,
            message.type === 'answer' ? styles.userMessageWrapper : styles.botMessageWrapper
          ]}>
            <View style={[
              styles.messageBubble,
              message.type === 'answer' ? styles.userBubble : styles.botBubble
            ]}>
              <Text style={[
                styles.messageText,
                message.type === 'answer' ? styles.userText : styles.botText
              ]}>
                {message.text}
              </Text>
              
              {message.type === 'question' && message.options && message.options.length > 0 && (
                <View style={styles.optionsList}>
                  {message.options.map((option: any, index: number) => (
                    <View key={option.id} style={styles.optionItem}>
                      <Text style={[styles.optionIndex, message.type === 'answer' ? styles.userText : styles.botText]}>
                        {index + 1}.
                      </Text>
                      <Text style={[styles.optionText, message.type === 'answer' ? styles.userText : styles.botText]}>
                        {option.answerTrigger}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              
              {message.type === 'question' && <View style={styles.botTail} />}
              {message.type === 'answer' && <View style={styles.userTail} />}
            </View>
          </View>
        ))}
        
        {loading && (
          <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
            <View style={[styles.messageBubble, styles.botBubble]}>
              <ActivityIndicator size="small" color={Colors.teal.base} />
            </View>
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
    backgroundColor: Colors.white[300] 
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  botMessageWrapper: {
    alignSelf: 'flex-start',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    borderRadius: 18,
    padding: 16,
    position: 'relative',
  },
  botBubble: {
    backgroundColor: Colors.white[500],
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  userBubble: {
    backgroundColor: Colors.teal.base,
  },
  botTail: {
    position: 'absolute',
    left: -8,
    bottom: 16,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: Colors.white[500],
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
  userTail: {
    position: 'absolute',
    right: -8,
    bottom: 16,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: Colors.teal.base,
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
  messageText: {
    ...globalStyles.text1,
    lineHeight: 22,
  },
  botText: {
    color: Colors.black.base,
  },
  userText: {
    color: Colors.white[300],
  },
  optionsList: {
    marginTop: 12,
    gap: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  optionIndex: {
    fontWeight: '700',
    minWidth: 20,
    fontSize: 14,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  optionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  buttons: {
    width: '100%',
    gap: 10,
    display: 'flex',
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
    ...globalStyles.text1,
  },
});
