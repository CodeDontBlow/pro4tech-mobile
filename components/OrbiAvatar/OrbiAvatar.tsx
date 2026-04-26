import React from 'react';
import { Image, View } from 'react-native';
import styles from './orbiAvatar.styles';

type Variant = 'default' | 'sleep';

type Props = {
  variant?: Variant;
  size?: number;
};

const IMAGES = {
  default: require('@/assets/logos/Orbi.png'),
  sleep: require('@/assets/logos/Orbi Sleep.png'),
};

export default function OrbiAvatar({ variant = 'default', size = 120 }: Props) {
  return (
    <View style={styles.container}>
      <Image
        source={IMAGES[variant]}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </View>
  );
}