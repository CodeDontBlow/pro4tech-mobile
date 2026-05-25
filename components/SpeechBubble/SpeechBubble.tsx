import { globalStyles } from '@/constants/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';
import styles from './speechBubble.styles';

type Option = {
  id: string;
  answerTrigger: string;
};

type Props = {
  type: 'bot' | 'user';
  text: string;
  time?: string;
  options?: Option[];
  attachments?: {
    url: string;
    mimeType: string;
    originalName: string;
    size: number;
  }[];
  onLongPress?: () => void;
  onPress?: () => void;
};

const formatBytes = (value: number) => {
  if (!Number.isFinite(value)) return '';
  if (value < 1024) return `${value} B`;
  const kb = value / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const openUrl = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.warn('Nao foi possivel abrir o arquivo', error);
  }
};

export default function SpeechBubble({
  type,
  text,
  time,
  options,
  attachments,
  onLongPress,
  onPress,
}: Props) {
  const isUser = type === 'user';
  const items = attachments ?? [];

  return (
    // <TouchableOpacity onLongPress={onLongPress} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.wrapper, isUser ? styles.userWrapper : styles.botWrapper]}>
        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          {!!text && (
            <Text style={[globalStyles.text1, styles.text, isUser ? styles.userText : styles.botText]}>
              {text}
            </Text>
          )}

          {items.length > 0 && (
            <View style={styles.attachments}>
              {items.map((file) => {
                const isImage = file.mimeType.startsWith('image/');

                return (
                  <TouchableOpacity
                    key={`${file.url}-${file.originalName}`}
                    style={[
                      styles.attachmentCard,
                      isUser ? styles.attachmentCardUser : styles.attachmentCardBot,
                    ]}
                    onPress={() => openUrl(file.url)}
                    activeOpacity={0.8}
                  >
                    {isImage ? (
                      <Image source={{ uri: file.url }} style={styles.attachmentImage} />
                    ) : (
                      <View style={styles.attachmentIcon}>
                        <Ionicons name="document-text-outline" size={20} color={isUser ? '#E6FFF7' : '#2E2E2E'} />
                      </View>
                    )}

                    <View style={styles.attachmentInfo}>
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.attachmentName,
                          isUser ? styles.attachmentNameUser : styles.attachmentNameBot,
                        ]}
                      >
                        {file.originalName}
                      </Text>
                      <Text
                        style={[
                          styles.attachmentSize,
                          isUser ? styles.attachmentSizeUser : styles.attachmentSizeBot,
                        ]}
                      >
                        {formatBytes(file.size)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

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

          {time && (
            <Text style={[styles.time, isUser ? styles.timeUser : styles.timeBot]}>
              {time}
            </Text>
          )}

          <View style={isUser ? styles.userTail : styles.botTail} />
        </View>
      </View>
    // </TouchableOpacity>
  );
}