import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '@/constants/colors';
import styles from './chatInput.styles';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  onAttachPress?: () => void;
  isSending?: boolean;
};

export default function ChatInput({ value, onChangeText, onSend, onAttachPress, isSending }: Props) {
  const handleSend = () => {
    if (!value.trim()) return;
    onSend();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.attachButton}
        onPress={onAttachPress}
        disabled={isSending}
      >
        <Ionicons name="add-circle-outline" size={28} color={Colors.teal.base} />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Digite sua mensagem ...."
        placeholderTextColor={Colors.white[700]}
        value={value}
        onChangeText={onChangeText}
        multiline
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isSending}>
        <Ionicons name="send" size={20} color={Colors.white[300]} />
      </TouchableOpacity>
    </View>
  );
}