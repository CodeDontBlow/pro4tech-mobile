import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TextInput, View } from 'react-native';
import styles from './input.styles';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = {
  placeholder: string;
  icon: IconName;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  isError?: boolean;
};

export default function InputField({
  placeholder,
  icon,
  value,
  onChangeText,
  secureTextEntry = false,
  isError = false,
}: Props) {
  return (
    <View style={[styles.container, isError && styles.containerError]}>
      <Ionicons
        name={icon}
        size={18}
        color={styles.icon.color}
        style={styles.icon}
        pointerEvents="none" 
      />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
}