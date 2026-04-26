import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from '@/constants/globalStyles';
import styles from './alert.styles';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function Alert({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={[globalStyles.text1, styles.title]}>{title}</Text>
          <Text style={[globalStyles.text2, styles.message]}>{message}</Text>

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={[globalStyles.text2, styles.cancelText]}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={[globalStyles.text2, styles.confirmText]}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}