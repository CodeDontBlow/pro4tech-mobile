import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/colors';
import styles from './chatInput.styles';

type Props = {
  onSend: (text: string) => void;
};

export default function ChatInput({ onSend }: Props) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.attachButton}>
        <Ionicons name="add-circle-outline" size={28} color={Colors.teal.base} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Digite sua mensagem ...."
        placeholderTextColor={Colors.white[700]}
        value={text}
        onChangeText={setText}
        multiline
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Ionicons name="send" size={20} color={Colors.white[300]} />
      </TouchableOpacity>
    </View>
  );
}