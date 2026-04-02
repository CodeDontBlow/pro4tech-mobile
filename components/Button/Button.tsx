import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './button.styles';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function Button({ label, onPress, disabled = false }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}