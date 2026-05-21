import React from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocalAttachment } from '@/services/upload';
import Colors from '@/constants/colors';
import styles from './filePreview.styles';

const formatBytes = (value: number | undefined) => {
  if (!value || !Number.isFinite(value)) return '';
  if (value < 1024) return `${value} B`;
  const kb = value / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
};

const isImage = (mimeType?: string | null) => {
  return typeof mimeType === 'string' && mimeType.startsWith('image/');
};

interface FilePreviewProps {
  visible: boolean;
  files: LocalAttachment[];
  onCancel: () => void;
  onRemove: (index: number) => void;
  onConfirm: () => void;
  isSending?: boolean;
}

export default function FilePreview({
  visible,
  files,
  onCancel,
  onRemove,
  onConfirm,
  isSending,
}: FilePreviewProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Arquivos selecionados</Text>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={22} color={Colors.black[300]} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.list}>
            {files.map((file, index) => (
              <View key={`${file.uri}-${index}`} style={styles.card}>
                {isImage(file.mimeType) ? (
                  <Image source={{ uri: file.uri }} style={styles.thumb} />
                ) : (
                  <View style={styles.iconWrap}>
                    <Ionicons name="document-text-outline" size={20} color={Colors.black[300]} />
                  </View>
                )}

                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.meta}>
                    {formatBytes((file as any).size)}
                  </Text>
                </View>

                <TouchableOpacity onPress={() => onRemove(index)}>
                  <Ionicons name="trash-outline" size={18} color={Colors.red.base} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sendButton, isSending && styles.sendButtonDisabled]}
              onPress={onConfirm}
              disabled={isSending}
            >
              <Text style={styles.sendText}>Enviar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
