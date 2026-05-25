import { globalStyles } from '@/constants/globalStyles';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './header.styles';

type Props = {
  title?: string;
  showBack?: boolean;
  showProfile?: boolean;
  onBack?: () => void;
  profileRoute?: any;
};

export default function Header({
  title = 'ORBITA',
  showBack = false,
  showProfile = true,
  onBack,
  profileRoute = '/profile'
}: Props) {

  return (
    <View style={styles.container}>

      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={onBack ?? (() => router.back())}
            style={styles.iconButton}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={styles.icon.color}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[globalStyles.title2, styles.title]}>
        {title}
      </Text>

      <View style={styles.right}>
        {showProfile && (
          <TouchableOpacity
            onPress={() => router.push(profileRoute)}
            style={styles.iconButton}
          >
            <Ionicons
              name="person-circle-sharp"
              size={40}
              color={styles.icon.color}
            />
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}