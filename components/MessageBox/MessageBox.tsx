import React from 'react';
import { Text, View } from 'react-native';
import { globalStyles } from '@/constants/globalStyles';
import styles from './messageBox.styles';

type Props = {
  text: string;
};

export default function MessageBox({ text }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[globalStyles.text2, styles.text]}>{text}</Text>
    </View>
  );
}