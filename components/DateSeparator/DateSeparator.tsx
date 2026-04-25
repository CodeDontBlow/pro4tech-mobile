import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '@/constants/globalStyles';
import styles from './dateSeparator.styles';

type Props = {
  label: string;
};

export default function DateSeparator({ label }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[globalStyles.label2, styles.label]}>{label}</Text>
    </View>
  );
}