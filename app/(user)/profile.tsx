import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Header from '@/components/Header/Header';
import Colors from '@/constants/colors';
import { globalStyles } from '@/constants/globalStyles';

export default function Profile() {
  return (
    <View style={styles.container}>
      <Header title="Perfil" showBack showProfile={false} />
      <View style={styles.content}>
        <Text style={[globalStyles.text1, styles.placeholder]}>
          Perfil
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white[300],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: Colors.black.base,
  },
});