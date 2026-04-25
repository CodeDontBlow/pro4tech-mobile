import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '@/constants/globalStyles';
import styles from './speechBubble.styles';

type Option = {
  id: string;
  answerTrigger: string;
};

type Props = {
  type: 'bot' | 'user';
  text: string;
  options?: Option[];
};

export default function SpeechBubble({ type, text, options }: Props) {
  const isUser = type === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[globalStyles.text1, styles.text, isUser ? styles.userText : styles.botText]}>
          {text}
        </Text>

        {!isUser && options && options.length > 0 && (
          <View style={styles.optionsList}>
            {options.map((option, index) => (
              <View key={option.id} style={styles.optionItem}>
                <Text style={[styles.optionIndex, styles.botText]}>{index + 1}.</Text>
                <Text style={[styles.optionText, styles.botText]}>{option.answerTrigger}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={isUser ? styles.userTail : styles.botTail} />
      </View>
    </View>
  );
}