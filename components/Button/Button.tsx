import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styles from './button.styles';

type Variant = 'primary' | 'light' | 'error';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: Variant;
  style?: object;
  textStyle?: object;
};

export default function Button({ label, onPress, disabled = false, variant = 'primary', style, textStyle }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'light' && styles.buttonLight,
        variant === 'error' && styles.buttonError,
        disabled && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, variant === 'light' && styles.buttonTextLight, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}